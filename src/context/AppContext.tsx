import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, Order, Station, StationId, UserRole } from '../types';
import { INITIAL_STATIONS, MENU_ITEMS, SHELF_BAYS_RU, SHELF_BAYS_KZ, SHELF_BAYS_EN } from '../data/initialData';
import { calculateJITSchedule, minutesToTimeString, timeStringToMinutes } from '../engine/scheduler';
import { Language, Translations, TRANSLATIONS } from '../i18n/translations';
import { playNewOrderSound, playOrderReadySound, playPickupSuccessSound, isSoundEnabled, setSoundEnabled } from '../utils/audio';

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
  const now = new Date();
  const currentTotalMins = now.getHours() * 60 + now.getMinutes();

  const timeReady = minutesToTimeString(currentTotalMins - 2);
  const timeCooking = minutesToTimeString(currentTotalMins + 8);
  const timeScheduled = minutesToTimeString(currentTotalMins + 20);

  return [
    {
      id: 'ord_181',
      orderNumber: '181',
      customerName: 'Асель К.',
      items: [
        { menuItemId: 'm6', name: 'Салат Цезарь с курицей', quantity: 1, unitPrice: 1800, prepMinutes: 7, station: 'prep' },
        { menuItemId: 'm8', name: 'Домашний лимонад с мятой', quantity: 1, unitPrice: 650, prepMinutes: 2, station: 'coffee' }
      ],
      totalAmount: 2450,
      requestedPickupTime: timeReady,
      status: 'READY',
      estimatedReadyTime: minutesToTimeString(currentTotalMins - 4),
      scheduledFireTime: minutesToTimeString(currentTotalMins - 11),
      shelfBay: 'Полка A1',
      delayMinutes: 0,
      createdAt: Date.now() - 15 * 60 * 1000,
      cookingStartedAt: Date.now() - 8 * 60 * 1000,
      readyAt: Date.now() - 2 * 60 * 1000,
    },
    {
      id: 'ord_182',
      orderNumber: '182',
      customerName: 'Данияр М.',
      items: [
        { menuItemId: 'm2', name: 'Двойной чизбургер с дымком', quantity: 1, unitPrice: 2400, prepMinutes: 14, station: 'grill' },
        { menuItemId: 'm5', name: 'Хрустящие луковые кольца', quantity: 1, unitPrice: 950, prepMinutes: 6, station: 'fryer' }
      ],
      totalAmount: 3350,
      requestedPickupTime: timeCooking,
      status: 'COOKING',
      estimatedReadyTime: minutesToTimeString(currentTotalMins + 6),
      scheduledFireTime: minutesToTimeString(currentTotalMins - 8),
      delayMinutes: 0,
      createdAt: Date.now() - 8 * 60 * 1000,
      cookingStartedAt: Date.now() - 4 * 60 * 1000,
    },
    {
      id: 'ord_183',
      orderNumber: '183',
      customerName: 'Elena R.',
      items: [
        { menuItemId: 'm3', name: 'Пицца Пепперони из печи', quantity: 1, unitPrice: 2800, prepMinutes: 20, station: 'oven' }
      ],
      totalAmount: 2800,
      requestedPickupTime: timeScheduled,
      status: 'SCHEDULED',
      estimatedReadyTime: minutesToTimeString(currentTotalMins + 18),
      scheduledFireTime: minutesToTimeString(currentTotalMins - 2),
      delayMinutes: 0,
      createdAt: Date.now() - 2 * 60 * 1000,
    }
  ];
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

  const [menuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('express_orders');
    return saved ? JSON.parse(saved) : getInitialOrders();
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
  // Default step: directly to menu (eliminates unnecessary zone/venue screen)
  const [customerStep, setCustomerStep] = useState<'venue' | 'menu' | 'slot' | 'confirm' | 'tracking' | 'ready' | 'history'>('menu');
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

  const linkCustomerPhone = (phone: string) => {
    const cleanPhone = phone.trim();
    if (!cleanPhone) return;
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
    const orderNum = (180 + orders.length + 1).toString();
    const id = `ord_${orderNum}`;

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

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    setMyOrderIds(prev => [newOrder.id, ...prev.filter(id => id !== newOrder.id)]);
    clearCart();
    playNewOrderSound();
    return newOrder;
  };

  const advanceOrderStatus = (orderId: string, customBay?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;

        if (ord.status === 'SCHEDULED') {
          return {
            ...ord,
            status: 'COOKING',
            cookingStartedAt: Date.now()
          };
        }

        if (ord.status === 'COOKING') {
          const usedBays = prev.filter(o => o.status === 'READY').map(o => o.shelfBay);
          const defaultBay = shelfBays[0] || 'Полка A1';
          const availableBay = customBay || shelfBays.find(b => !usedBays.includes(b)) || defaultBay;

          playOrderReadySound();
          return {
            ...ord,
            status: 'READY',
            readyAt: Date.now(),
            shelfBay: availableBay
          };
        }

        if (ord.status === 'READY') {
          const now = Date.now();
          const readyTime = ord.readyAt || (now - 60000);
          const waitSecs = Math.max(45, Math.round((now - readyTime) / 1000));

          return {
            ...ord,
            status: 'PICKED_UP',
            pickedUpAt: now,
            actualWaitTimeSeconds: waitSecs
          };
        }

        return ord;
      })
    );
  };

  const delayOrder = (orderId: string, minutes: number, reason?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          delayMinutes: (ord.delayMinutes || 0) + minutes,
          delayReason: reason || (lang === 'kz' ? 'Асхана жүктемесі жоғары' : lang === 'en' ? 'Kitchen rush' : 'Высокая загрузка кухни')
        };
      })
    );
  };

  const cancelOrder = (orderId: string): boolean => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return false;

    if (target.status !== 'SCHEDULED') {
      return false;
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
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

