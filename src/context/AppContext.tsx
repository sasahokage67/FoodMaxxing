import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, Order, Station, StationId, UserRole } from '../types';
import { INITIAL_STATIONS, MENU_ITEMS, SHELF_BAYS_RU, SHELF_BAYS_KZ, SHELF_BAYS_EN } from '../data/initialData';
import { calculateJITSchedule, minutesToTimeString, timeStringToMinutes } from '../engine/scheduler';
import { Language, Translations, TRANSLATIONS } from '../i18n/translations';
import { playNewOrderSound, playOrderReadySound, playPickupSuccessSound, isSoundEnabled, setSoundEnabled } from '../utils/audio';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  stations: Station[];
  menuItems: MenuItem[];
  orders: Order[];
  cart: CartItem[];
  activeTab: 'customer' | 'kitchen';
  userRole: UserRole;
  customerId: string;
  customerPhone: string;
  linkCustomerPhone: (phone: string) => void;
  logoutCustomer: () => void;
  customerStep: 'venue' | 'menu' | 'slot' | 'confirm' | 'tracking' | 'ready' | 'history';
  activeOrderId: string | null;
  myOrderIds: string[];
  currentTimeStr: string;
  currentTimeFullStr: string;
  currentDate: Date;
  shelfBays: string[];
  lastScannedOrder: Order | null;
  soundEnabled: boolean;
  toggleSound: () => void;
  
  setActiveTab: (tab: 'customer' | 'kitchen') => void;
  setUserRole: (role: UserRole) => void;
  unlockKitchenWithPin: (pin: string) => boolean;
  lockKitchen: () => void;
  setCustomerStep: (step: 'venue' | 'menu' | 'slot' | 'confirm' | 'tracking' | 'ready' | 'history') => void;
  setActiveOrderId: (id: string | null) => void;
  setLastScannedOrder: (order: Order | null) => void;

  addToCart: (item: MenuItem) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;

  createOrder: (data: { customerName: string; customerPhone?: string; pickupTime: string }) => Order;
  advanceOrderStatus: (orderId: string, customBay?: string) => void;
  delayOrder: (orderId: string, minutes: number, reason?: string) => void;
  cancelOrder: (orderId: string) => boolean;
  verifyPickup: (orderNumberOrId: string) => { success: boolean; order?: Order; message: string };

  setStationCapacity: (stationId: StationId, capacity: number) => void;
  advanceClock: (minutes: number) => void;
  setTimeStr: (time: string) => void;
  resetDemoData: () => void;

  getItemName: (item: MenuItem) => string;
  getItemDesc: (item: MenuItem) => string;
  getStationName: (station: Station) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function getInitialOrders(): Order[] {
  return [];
}

export function mapDbToOrder(row: any): Order {
  return {
    id: String(row.id),
    orderNumber: String(row.order_number || row.id),
    customerId: row.customer_id ? String(row.customer_id) : undefined,
    customerName: String(row.customer_name || ''),
    customerPhone: row.customer_phone ? String(row.customer_phone) : undefined,
    items: Array.isArray(row.items) ? row.items : [],
    totalAmount: Number(row.total_amount) || 0,
    requestedPickupTime: String(row.requested_pickup_time || ''),
    status: (row.status as any) || 'SCHEDULED',
    estimatedReadyTime: String(row.estimated_ready_time || ''),
    scheduledFireTime: String(row.scheduled_fire_time || ''),
    shelfBay: row.shelf_bay ? String(row.shelf_bay) : undefined,
    delayMinutes: Number(row.delay_minutes) || 0,
    delayReason: row.delay_reason ? String(row.delay_reason) : undefined,
    createdAt: Number(row.created_at) || Date.now(),
    cookingStartedAt: row.cooking_started_at ? Number(row.cooking_started_at) : undefined,
    readyAt: row.ready_at ? Number(row.ready_at) : undefined,
    pickedUpAt: row.picked_up_at ? Number(row.picked_up_at) : undefined,
    actualWaitTimeSeconds: row.actual_wait_time_seconds ? Number(row.actual_wait_time_seconds) : undefined,
  };
}

export function mapOrderToDb(order: Order): Record<string, any> {
  return {
    id: order.id,
    order_number: order.orderNumber,
    customer_id: order.customerId || null,
    customer_name: order.customerName,
    customer_phone: order.customerPhone || null,
    items: order.items,
    total_amount: order.totalAmount,
    requested_pickup_time: order.requestedPickupTime,
    status: order.status,
    estimated_ready_time: order.estimatedReadyTime,
    scheduled_fire_time: order.scheduledFireTime,
    shelf_bay: order.shelfBay || null,
    delay_minutes: order.delayMinutes || 0,
    delay_reason: order.delayReason || null,
    created_at: order.createdAt,
    cooking_started_at: order.cookingStartedAt || null,
    ready_at: order.readyAt || null,
    picked_up_at: order.pickedUpAt || null,
    actual_wait_time_seconds: order.actualWaitTimeSeconds || null,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('express_lang');
    return (saved as Language) || 'ru';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('express_lang', newLang);
  };

  const t = TRANSLATIONS[lang];
  const shelfBays = lang === 'kz' ? SHELF_BAYS_KZ : lang === 'en' ? SHELF_BAYS_EN : SHELF_BAYS_RU;

  const [stations, setStations] = useState<Station[]>(() => {
    const saved = localStorage.getItem('express_stations');
    return saved ? JSON.parse(saved) : INITIAL_STATIONS;
  });

  const isLegacyMockOrder = (o: Order) => {
    const name = o.customerName?.toLowerCase() || '';
    if (name.includes('елена') || name.includes('elena') || name.includes('асель') || name.includes('данияр')) {
      return true;
    }
    if ((o.id === 'ord_181' || o.id === 'ord_182' || o.id === 'ord_183') && (!o.createdAt || o.createdAt < 1700000000000)) {
      return true;
    }
    return false;
  };

  const [menuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('express_orders');
    if (!saved) return [];
    try {
      const parsed: Order[] = JSON.parse(saved);
      const filtered = parsed.filter(o => !isLegacyMockOrder(o));
      localStorage.setItem('express_orders', JSON.stringify(filtered));
      return filtered;
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('express_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('express_user_role') as UserRole;
    return saved || 'customer';
  });

  const [customerId] = useState<string>(() => {
    let id = localStorage.getItem('express_customer_id');
    if (!id) {
      id = 'usr_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('express_customer_id', id);
    }
    return id;
  });

  const [activeTab, setActiveTab] = useState<'customer' | 'kitchen'>('customer');
  // Default step: directly to venue selection
  const [customerStep, setCustomerStep] = useState<'venue' | 'menu' | 'slot' | 'confirm' | 'tracking' | 'ready' | 'history'>('venue');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return localStorage.getItem('express_active_order_id') || null;
  });

  // Only orders placed from this client account
  const [myOrderIds, setMyOrderIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('express_my_order_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [customerPhone, setCustomerPhone] = useState<string>(() => {
    return localStorage.getItem('express_customer_phone') || '';
  });

  const logoutCustomer = () => {
    setCustomerPhone('');
    localStorage.removeItem('express_customer_phone');
    localStorage.removeItem('express_active_order_id');
    localStorage.removeItem('express_my_order_ids');
    setActiveOrderId(null);
    setMyOrderIds([]);
  };

  const linkCustomerPhone = (phone: string) => {
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      logoutCustomer();
      return;
    }
    setCustomerPhone(cleanPhone);
    localStorage.setItem('express_customer_phone', cleanPhone);
    setOrders(prev => {
      const matchingIds: string[] = [];
      const updated = prev.map(o => {
        if (o.customerPhone && o.customerPhone === cleanPhone) {
          matchingIds.push(o.id);
          return { ...o, customerId };
        }
        return o;
      });
      if (matchingIds.length > 0) {
        setMyOrderIds(current => Array.from(new Set([...current, ...matchingIds])));
      }
      return updated;
    });
  };

  const unlockKitchenWithPin = (pin: string): boolean => {
    // Valid staff PINs for catering / hackathon demo
    const cleanPin = pin.trim();
    if (cleanPin === '2026' || cleanPin === '1234' || cleanPin === '7788') {
      setUserRole('kitchen');
      localStorage.setItem('express_user_role', 'kitchen');
      setActiveTab('kitchen');
      return true;
    }
    return false;
  };

  const lockKitchen = () => {
    setUserRole('customer');
    localStorage.setItem('express_user_role', 'customer');
    setActiveTab('customer');
    setCustomerStep('menu');
  };

  useEffect(() => {
    localStorage.setItem('express_my_order_ids', JSON.stringify(myOrderIds));
  }, [myOrderIds]);

  // Real-time ticking clock
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Immediate purge of any legacy mock orders on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('express_orders');
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        const filtered = parsed.filter(o => !isLegacyMockOrder(o));
        if (filtered.length !== parsed.length) {
          localStorage.setItem('express_orders', JSON.stringify(filtered));
          setOrders(filtered);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const currentTimeStr = `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
  const currentTimeFullStr = `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

  const [lastScannedOrder, setLastScannedOrder] = useState<Order | null>(null);

  // Sound toggle
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(isSoundEnabled);
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    setSoundEnabled(next);
  };

  // Broadcast channel for instantaneous cross-tab synchronization
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('express_pickup_sync_channel');
      const handleMessage = (e: MessageEvent) => {
        if (e.data?.type === 'SYNC_STATE') {
          const savedOrders = localStorage.getItem('express_orders');
          if (savedOrders) setOrders(JSON.parse(savedOrders));
          const savedStations = localStorage.getItem('express_stations');
          if (savedStations) setStations(JSON.parse(savedStations));
        }
      };
      channel.addEventListener('message', handleMessage);
    } catch {
      // ignore
    }
    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, []);

  // Supabase Realtime synchronization across customer & kitchen devices
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }: { data: any; error: any }) => {
        if (error) {
          console.error('Supabase initial fetch error:', error.message);
          return;
        }
        if (data && data.length > 0) {
          const loadedOrders = data.map(mapDbToOrder).filter((o: Order) => !isLegacyMockOrder(o));
          setOrders(loadedOrders);
          try {
            localStorage.setItem('express_orders', JSON.stringify(loadedOrders));
          } catch {
            // ignore
          }
        }
      });

    const channel = supabase
      .channel('express-orders-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = mapDbToOrder(payload.new);
            if (isLegacyMockOrder(newOrder)) return;
            setOrders(prev => {
              if (prev.some(o => o.id === newOrder.id)) return prev;
              playNewOrderSound();
              return [newOrder, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapDbToOrder(payload.new);
            setOrders(prev => {
              const existing = prev.find(o => o.id === updated.id);
              if (existing && existing.status !== updated.status) {
                if (updated.status === 'READY') {
                  playOrderReadySound();
                } else if (updated.status === 'PICKED_UP') {
                  playPickupSuccessSound();
                }
              }
              return prev.map(o => (o.id === updated.id ? updated : o));
            });
          } else if (payload.eventType === 'DELETE') {
            if (payload.old && payload.old.id) {
              setOrders(prev => prev.filter(o => o.id !== payload.old.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const broadcastSync = () => {
    try {
      const channel = new BroadcastChannel('express_pickup_sync_channel');
      channel.postMessage({ type: 'SYNC_STATE' });
      channel.close();
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    localStorage.setItem('express_orders', JSON.stringify(orders));
    broadcastSync();
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('express_stations', JSON.stringify(stations));
    broadcastSync();
  }, [stations]);

  useEffect(() => {
    localStorage.setItem('express_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem('express_active_order_id', activeOrderId);
    }
  }, [activeOrderId]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(ci => {
          if (ci.menuItem.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const getItemName = (item: MenuItem) => {
    if (lang === 'kz' && item.nameKz) return item.nameKz;
    if (lang === 'en' && item.nameEn) return item.nameEn;
    return item.nameRu || item.name;
  };

  const getItemDesc = (item: MenuItem) => {
    if (lang === 'kz' && item.descKz) return item.descKz;
    if (lang === 'en' && item.descEn) return item.descEn;
    return item.descRu || item.description;
  };

  const getStationName = (station: Station) => {
    if (lang === 'kz' && station.nameKz) return station.nameKz;
    if (lang === 'en' && station.nameEn) return station.nameEn;
    return station.nameRu || station.name;
  };

  const createOrder = ({
    customerName,
    customerPhone,
    pickupTime
  }: {
    customerName: string;
    customerPhone?: string;
    pickupTime: string;
  }): Order => {
    // Generate clean 3-digit ticket numbers (starting from 201, e.g. #201, #202, #203)
    let nextNum = 201;
    if (orders.length > 0) {
      const nums = orders.map(o => parseInt(o.orderNumber, 10)).filter(n => !isNaN(n) && n >= 200);
      if (nums.length > 0) {
        nextNum = Math.max(...nums) + 1;
      }
    }
    const orderNum = nextNum.toString();
    const id = `ord_${Date.now()}_${orderNum}`;

    const jit = calculateJITSchedule(pickupTime, cart);
    const total = cart.reduce((acc, ci) => acc + ci.menuItem.price * ci.quantity, 0);

    const items = cart.map(ci => ({
      menuItemId: ci.menuItem.id,
      name: getItemName(ci.menuItem),
      quantity: ci.quantity,
      unitPrice: ci.menuItem.price,
      prepMinutes: ci.menuItem.prepMinutes,
      station: ci.menuItem.station
    }));

    const newOrder: Order = {
      id,
      orderNumber: orderNum,
      customerId,
      customerName: customerName.trim() || (lang === 'kz' ? 'Әлихан' : lang === 'en' ? 'Alex' : 'Алихан'),
      customerPhone: customerPhone?.trim(),
      items,
      totalAmount: total,
      requestedPickupTime: pickupTime,
      status: 'SCHEDULED',
      estimatedReadyTime: jit.estimatedReadyTime,
      scheduledFireTime: jit.scheduledFireTime,
      delayMinutes: 0,
      createdAt: Date.now()
    };

    if (customerPhone?.trim()) {
      linkCustomerPhone(customerPhone.trim());
    }

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem('express_orders', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (supabase && isSupabaseConfigured) {
      const dbPayload = mapOrderToDb(newOrder);
      supabase.from('orders').insert(dbPayload).then(({ error }: { error: any }) => {
        if (error) console.error('Supabase createOrder error:', error.message);
      });
    }

    setActiveOrderId(newOrder.id);
    setMyOrderIds(prev => [newOrder.id, ...prev.filter(myId => myId !== newOrder.id)]);
    try {
      localStorage.setItem('express_active_order_id', newOrder.id);
    } catch {
      // ignore
    }

    clearCart();
    playNewOrderSound();
    return newOrder;
  };

  const advanceOrderStatus = (orderId: string, customBay?: string) => {
    let targetUpdated: Order | null = null;
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;

        if (ord.status === 'SCHEDULED') {
          targetUpdated = {
            ...ord,
            status: 'COOKING',
            cookingStartedAt: Date.now()
          };
          return targetUpdated;
        }

        if (ord.status === 'COOKING') {
          const usedBays = prev.filter(o => o.status === 'READY').map(o => o.shelfBay);
          const defaultBay = shelfBays[0] || 'Полка A1';
          const availableBay = customBay || shelfBays.find(b => !usedBays.includes(b)) || defaultBay;

          playOrderReadySound();
          targetUpdated = {
            ...ord,
            status: 'READY',
            readyAt: Date.now(),
            shelfBay: availableBay
          };
          return targetUpdated;
        }

        if (ord.status === 'READY') {
          const now = Date.now();
          const readyTime = ord.readyAt || (now - 60000);
          const waitSecs = Math.max(45, Math.round((now - readyTime) / 1000));

          targetUpdated = {
            ...ord,
            status: 'PICKED_UP',
            pickedUpAt: now,
            actualWaitTimeSeconds: waitSecs
          };
          return targetUpdated;
        }

        return ord;
      })
    );

    if (targetUpdated && supabase && isSupabaseConfigured) {
      const dbPayload = mapOrderToDb(targetUpdated);
      supabase.from('orders').update(dbPayload).eq('id', orderId).then(({ error }: { error: any }) => {
        if (error) console.error('Supabase advanceOrderStatus error:', error.message);
      });
    }
  };

  const delayOrder = (orderId: string, minutes: number, reason?: string) => {
    let targetUpdated: Order | null = null;
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        targetUpdated = {
          ...ord,
          delayMinutes: (ord.delayMinutes || 0) + minutes,
          delayReason: reason || (lang === 'kz' ? 'Асхана жүктемесі жоғары' : lang === 'en' ? 'Kitchen rush' : 'Высокая загрузка кухни')
        };
        return targetUpdated;
      })
    );

    if (targetUpdated && supabase && isSupabaseConfigured) {
      const dbPayload = mapOrderToDb(targetUpdated);
      supabase.from('orders').update(dbPayload).eq('id', orderId).then(({ error }: { error: any }) => {
        if (error) console.error('Supabase delayOrder error:', error.message);
      });
    }
  };

  const cancelOrder = (orderId: string): boolean => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return false;

    if (target.status !== 'SCHEDULED') {
      return false;
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));

    if (supabase && isSupabaseConfigured) {
      supabase.from('orders').update({ status: 'CANCELLED' }).eq('id', orderId).then(({ error }: { error: any }) => {
        if (error) console.error('Supabase cancelOrder error:', error.message);
      });
    }
    return true;
  };

  const verifyPickup = (orderNumberOrId: string) => {
    const clean = orderNumberOrId.trim().replace('#', '').toLowerCase();
    const order = orders.find(
      o => o.orderNumber.toLowerCase() === clean || o.id.toLowerCase() === clean
    );

    if (!order) {
      return {
        success: false,
        message: lang === 'kz'
          ? `№${orderNumberOrId} тапсырысы табылмады.`
          : lang === 'en'
          ? `Order #${orderNumberOrId} not found.`
          : `Заказ #${orderNumberOrId} не найден.`
      };
    }

    if (order.status === 'PICKED_UP') {
      return {
        success: true,
        order,
        message: lang === 'kz'
          ? `№${order.orderNumber} тапсырысы бұрын берілген.`
          : lang === 'en'
          ? `Order #${order.orderNumber} already collected.`
          : `Заказ #${order.orderNumber} уже был выдан ранее.`
      };
    }

    const now = Date.now();
    const readyTime = order.readyAt || (now - 74000);
    const waitSecs = Math.max(45, Math.round((now - readyTime) / 1000));

    const updatedOrder: Order = {
      ...order,
      status: 'PICKED_UP',
      pickedUpAt: now,
      actualWaitTimeSeconds: waitSecs
    };

    setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
    setLastScannedOrder(updatedOrder);
    playPickupSuccessSound();

    if (supabase && isSupabaseConfigured) {
      const dbPayload = mapOrderToDb(updatedOrder);
      supabase.from('orders').update(dbPayload).eq('id', order.id).then(({ error }: { error: any }) => {
        if (error) console.error('Supabase verifyPickup error:', error.message);
      });
    }

    return {
      success: true,
      order: updatedOrder,
      message: lang === 'kz'
        ? `Сәтті! №${order.orderNumber} тапсырысы берілді (${order.customerName}).`
        : lang === 'en'
        ? `Verified! Order #${order.orderNumber} handed over to ${order.customerName}.`
        : `Успешно! Заказ #${order.orderNumber} выдан клиенту (${order.customerName}).`
    };
  };

  const setStationCapacity = (stationId: StationId, capacity: number) => {
    setStations(prev =>
      prev.map(s => (s.id === stationId ? { ...s, capacity: Math.max(1, capacity) } : s))
    );
  };

  const advanceClock = (_minutes: number) => {
    // Clock is now real-time
  };

  const resetDemoData = () => {
    const freshOrders = getInitialOrders();
    setOrders(freshOrders);
    setStations(INITIAL_STATIONS);
    setMyOrderIds([]);
    setActiveOrderId(null);
    localStorage.setItem('express_orders', JSON.stringify(freshOrders));
    localStorage.setItem('express_stations', JSON.stringify(INITIAL_STATIONS));
    localStorage.setItem('express_my_order_ids', JSON.stringify([]));
    localStorage.removeItem('express_active_order_id');
    broadcastSync();

    if (supabase && isSupabaseConfigured) {
      supabase.from('orders').delete().neq('id', '').then(({ error }: { error: any }) => {
        if (error) console.error('Supabase resetDemoData error:', error.message);
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        stations,
        menuItems,
        orders,
        cart,
        activeTab,
        userRole,
        customerId,
        customerPhone,
        linkCustomerPhone,
        logoutCustomer,
        customerStep,
        activeOrderId,
        myOrderIds,
        currentTimeStr,
        currentTimeFullStr,
        currentDate,
        shelfBays,
        lastScannedOrder,
        soundEnabled,
        toggleSound,
        setActiveTab,
        setUserRole,
        unlockKitchenWithPin,
        lockKitchen,
        setCustomerStep,
        setActiveOrderId,
        setLastScannedOrder,
        addToCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        advanceOrderStatus,
        delayOrder,
        cancelOrder,
        verifyPickup,
        setStationCapacity,
        advanceClock,
        setTimeStr: () => {},
        resetDemoData,
        getItemName,
        getItemDesc,
        getStationName
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

