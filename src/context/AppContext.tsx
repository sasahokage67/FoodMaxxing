import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, MenuItem, Order, Station, StationId, UserRole, KitchenInquiry, Venue } from '../types';
import { INITIAL_STATIONS, MENU_ITEMS, SHELF_BAYS_RU, SHELF_BAYS_KZ, SHELF_BAYS_EN } from '../data/initialData';
import { calculateJITSchedule, minutesToTimeString, timeStringToMinutes } from '../engine/scheduler';
import { Language, Translations, TRANSLATIONS } from '../i18n/translations';
import { playNewOrderSound, playOrderReadySound, playPickupSuccessSound, isSoundEnabled, setSoundEnabled } from '../utils/audio';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { phonesMatch, normalizePhoneDigits, ADMIN_PHONE, isAdminPhone } from '../utils/phoneFormatter';

export const isLegacyMockOrder = (o: Order) => {
  const name = o.customerName?.toLowerCase() || '';
  if (name.includes('елена') || name.includes('elena') || name.includes('асель') || name.includes('данияр')) {
    return true;
  }
  if ((o.id === 'ord_181' || o.id === 'ord_182' || o.id === 'ord_183') && (!o.createdAt || o.createdAt < 1700000000000)) {
    return true;
  }
  return false;
};

export function isUserOrder(
  order: Order,
  customerPhone?: string,
  customerId?: string,
  myOrderIds: string[] = []
): boolean {
  if (isLegacyMockOrder(order)) return false;

  // 1. If currently logged in with a customer phone number:
  if (customerPhone && customerPhone.trim()) {
    // If the order has a customerPhone, it MUST match the logged in phone!
    if (order.customerPhone && order.customerPhone.trim()) {
      return phonesMatch(order.customerPhone, customerPhone);
    }
    // If the order has NO phone, only match if the customerId matches this user's phone customerId AND order is in myOrderIds
    const expectedCid = customerId || ('usr_' + normalizePhoneDigits(customerPhone));
    if (order.customerId && order.customerId === expectedCid && myOrderIds && myOrderIds.includes(order.id)) {
      return true;
    }
    return false;
  }

  // 2. If NOT logged in with a phone (guest mode):
  // Any order with a registered customerPhone MUST NEVER be shown to a guest!
  if (order.customerPhone && order.customerPhone.trim()) {
    return false;
  }

  // Anonymous guest order matching
  if (customerId && order.customerId && order.customerId === customerId) return true;
  if (myOrderIds && myOrderIds.includes(order.id)) return true;

  return false;
}

export interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  stations: Station[];
  menuItems: MenuItem[];
  orders: Order[];
  cart: CartItem[];
  activeTab: 'customer' | 'kitchen' | 'admin';
  userRole: UserRole;
  isAdmin: boolean;
  adminPhone: string;
  inquiries: KitchenInquiry[];
  approvedKitchenPhones: string[];
  approveInquiry: (id: string) => void;
  rejectInquiry: (id: string) => void;
  approveAllInquiries: () => void;
  deleteInquiry: (id: string) => void;
  enterAdminMode: () => void;
  lockAdmin: () => void;
  venues: Venue[];
  addVenue: (venue: Omit<Venue, 'id'>) => Venue;
  updateVenue: (id: string, updates: Partial<Venue>) => void;
  deleteVenue: (id: string) => void;
  toggleVenueActive: (id: string) => void;
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
  venueName: string;
  setVenueName: (name: string) => void;
  selectedVenueId: string;
  setSelectedVenueId: (id: string) => void;
  activeVenue: Venue | undefined;
  allMenuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>, targetVenueId?: string) => MenuItem;
  deleteMenuItem: (itemId: string) => void;
  toggleMenuItemAvailability: (itemId: string) => void;
  
  setActiveTab: (tab: 'customer' | 'kitchen' | 'admin') => void;
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

  const DEFAULT_VENUES: Venue[] = [
    {
      id: 'venue_main',
      name: 'Университетская столовая',
      location: 'Главный корпус, 1 этаж',
      phone: '+7 (778) 508 86 63',
      isActive: true,
      isPrimary: true,
      prepTime: '5-8 мин',
      openingHours: '08:30 - 18:00'
    }
  ];

  const [venues, setVenues] = useState<Venue[]>(() => {
    try {
      const resetFlag = localStorage.getItem('foodmaxxing_venues_reset_v2');
      if (!resetFlag) {
        localStorage.setItem('foodmaxxing_venues_reset_v2', 'true');
        localStorage.setItem('foodmaxxing_venues', JSON.stringify(DEFAULT_VENUES));
        localStorage.setItem('express_selected_venue_id', 'venue_main');
        localStorage.setItem('express_venue_name', 'Университетская столовая');
        return DEFAULT_VENUES;
      }
      const saved = localStorage.getItem('foodmaxxing_venues');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    localStorage.setItem('foodmaxxing_venues', JSON.stringify(DEFAULT_VENUES));
    return DEFAULT_VENUES;
  });

  const [venueName, setVenueNameState] = useState<string>(() => {
    return localStorage.getItem('express_venue_name') || 'Университетская столовая';
  });

  const [selectedVenueId, setSelectedVenueIdState] = useState<string>(() => {
    return localStorage.getItem('express_selected_venue_id') || 'venue_main';
  });

  const setVenueName = (name: string) => {
    setVenueNameState(name);
    localStorage.setItem('express_venue_name', name);
  };

  const setSelectedVenueId = (id: string) => {
    setSelectedVenueIdState(id);
    localStorage.setItem('express_selected_venue_id', id);
  };

  const activeVenue = useMemo(() => {
    return (
      venues.find(v => (selectedVenueId && v.id === selectedVenueId) || (venueName && v.name.toLowerCase() === venueName.toLowerCase())) ||
      venues.find(v => v.isPrimary) ||
      venues[0]
    );
  }, [venues, selectedVenueId, venueName]);

  const addVenue = (v: Omit<Venue, 'id'>): Venue => {
    const newVenue: Venue = {
      ...v,
      id: `venue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    setVenues(prev => {
      const updated = [...prev, newVenue];
      try {
        localStorage.setItem('foodmaxxing_venues', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return newVenue;
  };

  const updateVenue = (id: string, updates: Partial<Venue>) => {
    setVenues(prev => {
      const updated = prev.map(v => (v.id === id ? { ...v, ...updates } : v));
      try {
        localStorage.setItem('foodmaxxing_venues', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleVenueActive = (id: string) => {
    setVenues(prev => {
      const updated = prev.map(v => (v.id === id ? { ...v, isActive: !v.isActive } : v));
      try {
        localStorage.setItem('foodmaxxing_venues', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('express_menu_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            ...item,
            venueId: item.venueId || 'venue_main',
            venueName: item.venueName || 'Университетская столовая'
          }));
        }
      } catch {}
    }
    const defaults = MENU_ITEMS.map(item => ({
      ...item,
      venueId: 'venue_main',
      venueName: 'Университетская столовая'
    }));
    try {
      localStorage.setItem('express_menu_items', JSON.stringify(defaults));
    } catch {}
    return defaults;
  });

  // Filtered menu items for the current active venue (newly created venues are strictly empty!)
  const menuItems = useMemo(() => {
    if (!activeVenue) return [];
    if (activeVenue.id === 'venue_main' || activeVenue.isPrimary) {
      return allMenuItems.filter(item => 
        !item.venueId || item.venueId === 'venue_main' || item.venueId === activeVenue.id
      );
    }
    return allMenuItems.filter(item => 
      (item.venueId && item.venueId === activeVenue.id) ||
      (item.venueName && item.venueName.toLowerCase() === activeVenue.name.toLowerCase())
    );
  }, [allMenuItems, activeVenue]);

  const addMenuItem = (item: Omit<MenuItem, 'id'>, targetVenueId?: string): MenuItem => {
    const targetV = venues.find(v => targetVenueId ? v.id === targetVenueId : ((selectedVenueId && v.id === selectedVenueId) || (venueName && v.name.toLowerCase() === venueName.toLowerCase()))) || activeVenue || venues[0];
    const newItem: MenuItem = {
      ...item,
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      venueId: targetV ? targetV.id : 'venue_main',
      venueName: targetV ? targetV.name : 'Университетская столовая'
    };
    setAllMenuItems(prev => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('express_menu_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return newItem;
  };

  const deleteMenuItem = (itemId: string) => {
    setAllMenuItems(prev => {
      const updated = prev.filter(m => m.id !== itemId);
      try {
        localStorage.setItem('express_menu_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleMenuItemAvailability = (itemId: string) => {
    setAllMenuItems(prev => {
      const updated = prev.map(m => (m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m));
      try {
        localStorage.setItem('express_menu_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteVenue = (id: string) => {
    setVenues(prev => {
      const updated = prev.filter(v => v.id !== id);
      try {
        localStorage.setItem('foodmaxxing_venues', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setAllMenuItems(prev => {
      const updated = prev.filter(m => m.venueId !== id);
      try {
        localStorage.setItem('express_menu_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };
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

  const [customerPhone, setCustomerPhone] = useState<string>(() => {
    return localStorage.getItem('express_customer_phone') || '';
  });

  const [customerId, setCustomerIdState] = useState<string>(() => {
    const savedPhone = localStorage.getItem('express_customer_phone') || '';
    if (savedPhone) {
      const phoneDigits = normalizePhoneDigits(savedPhone);
      if (phoneDigits) return 'usr_' + phoneDigits;
    }
    let guestId = localStorage.getItem('express_guest_id');
    if (!guestId) {
      guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('express_guest_id', guestId);
    }
    return guestId;
  });

  const [activeTab, setActiveTab] = useState<'customer' | 'kitchen' | 'admin'>('customer');
  // Default step: directly to venue selection
  const [customerStep, setCustomerStep] = useState<'venue' | 'menu' | 'slot' | 'confirm' | 'tracking' | 'ready' | 'history'>('venue');

  const isAdmin = userRole === 'admin';
  const adminPhone = ADMIN_PHONE;



  const [inquiries, setInquiries] = useState<KitchenInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('foodmaxxing_kitchen_inquiries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((i: any) => ({
            ...i,
            status: i.status || 'pending'
          }));
        }
      }
    } catch {}
    const defaults: KitchenInquiry[] = [
      {
        id: 'reg_dostyk_101',
        kitchenName: 'Столовая «Достык» (КазНУ)',
        locationName: 'Главный корпус, 1 этаж (пр. Аль-Фараби 71)',
        contactName: 'Ерлан Сагитов',
        phone: '+7(777)456 78 90',
        aiVerified: true,
        binIin: '040540012390',
        okedCode: '56.29',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'reg_bakery_102',
        kitchenName: 'Пекарня & Кофейня «BakeMaxx»',
        locationName: 'Блок В, 2 этаж (ул. Сатпаева 22)',
        contactName: 'Данияр Каримов',
        phone: '+7(702)234 56 78',
        aiVerified: true,
        binIin: '150240034567',
        okedCode: '56.10',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'reg_gourmet_103',
        kitchenName: 'Студенческое кафе «Dostyk Gourmet»',
        locationName: 'Кампус Математики, 1 этаж',
        contactName: 'Асель Мукашева',
        phone: '+7(775)890 12 34',
        aiVerified: true,
        binIin: '980140023411',
        okedCode: '56.10',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ];
    try {
      localStorage.setItem('foodmaxxing_kitchen_inquiries', JSON.stringify(defaults));
    } catch {}
    return defaults;
  });

  const [approvedKitchenPhones, setApprovedKitchenPhones] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('foodmaxxing_approved_kitchen_phones');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['7785088663', '7083210182'];
  });

  const approveInquiry = (inquiryId: string) => {
    setInquiries(prev => {
      const target = prev.find(i => i.id === inquiryId);
      const updated = prev.map(i => i.id === inquiryId ? { ...i, status: 'approved' as const } : i);
      try {
        localStorage.setItem('foodmaxxing_kitchen_inquiries', JSON.stringify(updated));
      } catch {}

      if (target) {
        setVenues(prevVenues => {
          const exists = prevVenues.some(v => v.id === target.id || v.name.toLowerCase() === target.kitchenName.toLowerCase());
          if (!exists) {
            const newVenue: Venue = {
              id: target.id,
              name: target.kitchenName,
              location: target.locationName || 'Главный корпус',
              phone: target.phone,
              isActive: true,
              isPrimary: false,
              prepTime: '10-12 мин'
            };
            const nextV = [...prevVenues, newVenue];
            try {
              localStorage.setItem('foodmaxxing_venues', JSON.stringify(nextV));
            } catch {}
            return nextV;
          }
          const nextV = prevVenues.map(v => (v.id === target.id || v.name.toLowerCase() === target.kitchenName.toLowerCase()) ? { ...v, isActive: true } : v);
          try {
            localStorage.setItem('foodmaxxing_venues', JSON.stringify(nextV));
          } catch {}
          return nextV;
        });
      }

      if (target && target.phone) {
        const norm = normalizePhoneDigits(target.phone);
        if (norm) {
          setApprovedKitchenPhones(phones => {
            const next = Array.from(new Set([...phones, norm]));
            try {
              localStorage.setItem('foodmaxxing_approved_kitchen_phones', JSON.stringify(next));
            } catch {}
            return next;
          });
        }
      }
      return updated;
    });
  };

  const rejectInquiry = (inquiryId: string) => {
    setInquiries(prev => {
      const updated = prev.map(i => i.id === inquiryId ? { ...i, status: 'rejected' as const } : i);
      try {
        localStorage.setItem('foodmaxxing_kitchen_inquiries', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const approveAllInquiries = () => {
    setInquiries(prev => {
      const updated = prev.map(i => ({ ...i, status: 'approved' as const }));
      try {
        localStorage.setItem('foodmaxxing_kitchen_inquiries', JSON.stringify(updated));
      } catch {}

      setVenues(prevVenues => {
        let nextV = [...prevVenues];
        for (const item of prev) {
          const exists = nextV.some(v => v.id === item.id || v.name.toLowerCase() === item.kitchenName.toLowerCase());
          if (!exists) {
            nextV.push({
              id: item.id,
              name: item.kitchenName,
              location: item.locationName || 'Главный корпус',
              phone: item.phone,
              isActive: true,
              isPrimary: false,
              prepTime: '10-12 мин'
            });
          } else {
            nextV = nextV.map(v => (v.id === item.id || v.name.toLowerCase() === item.kitchenName.toLowerCase()) ? { ...v, isActive: true } : v);
          }
        }
        try {
          localStorage.setItem('foodmaxxing_venues', JSON.stringify(nextV));
        } catch {}
        return nextV;
      });

      const newPhones = prev.map(i => normalizePhoneDigits(i.phone)).filter(Boolean);
      setApprovedKitchenPhones(phones => {
        const next = Array.from(new Set([...phones, ...newPhones]));
        try {
          localStorage.setItem('foodmaxxing_approved_kitchen_phones', JSON.stringify(next));
        } catch {}
        return next;
      });
      return updated;
    });
  };

  const deleteInquiry = (inquiryId: string) => {
    setInquiries(prev => {
      const updated = prev.filter(i => i.id !== inquiryId);
      try {
        localStorage.setItem('foodmaxxing_kitchen_inquiries', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const enterAdminMode = () => {
    setCustomerPhone('+7(708)321 01 82');
    localStorage.setItem('express_customer_phone', '+7(708)321 01 82');
    setUserRole('admin');
    localStorage.setItem('express_user_role', 'admin');
    setActiveTab('admin');
  };

  const lockAdmin = () => {
    setUserRole('customer');
    localStorage.setItem('express_user_role', 'customer');
    setCustomerPhone('');
    localStorage.removeItem('express_customer_phone');
    setActiveTab('customer');
  };

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    const savedPhone = localStorage.getItem('express_customer_phone') || '';
    if (savedPhone) {
      const phoneKey = normalizePhoneDigits(savedPhone);
      if (phoneKey) {
        return localStorage.getItem(`express_active_order_${phoneKey}`) || null;
      }
    }
    return null;
  });

  // Orders placed from this client account (scoped strictly per phone number)
  const [myOrderIds, setMyOrderIds] = useState<string[]>(() => {
    const savedPhone = localStorage.getItem('express_customer_phone') || '';
    if (savedPhone) {
      const phoneKey = normalizePhoneDigits(savedPhone);
      if (phoneKey) {
        const savedPhoneOrders = localStorage.getItem(`express_user_orders_${phoneKey}`);
        if (savedPhoneOrders) {
          try {
            return JSON.parse(savedPhoneOrders);
          } catch {}
        }
      }
    }
    return [];
  });

  const logoutCustomer = () => {
    setCustomerPhone('');
    localStorage.removeItem('express_customer_phone');
    localStorage.removeItem('express_active_order_id');
    setActiveOrderId(null);
    setMyOrderIds([]);
    setUserRole('customer');
    localStorage.setItem('express_user_role', 'customer');
    setActiveTab('customer');
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    setCustomerIdState(guestId);
    localStorage.setItem('express_guest_id', guestId);
  };

  const linkCustomerPhone = (phone: string) => {
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      logoutCustomer();
      return;
    }
    const phoneKey = normalizePhoneDigits(cleanPhone);
    const newCid = 'usr_' + phoneKey;

    setCustomerPhone(cleanPhone);
    setCustomerIdState(newCid);
    localStorage.setItem('express_customer_phone', cleanPhone);
    localStorage.setItem('express_customer_id', newCid);

    // 1. Find orders in memory that belong to this phone number
    const matchingFromState = orders
      .filter(o => phonesMatch(o.customerPhone, cleanPhone))
      .map(o => o.id);

    // 2. Load orders previously saved for this phone in localStorage
    let savedForPhone: string[] = [];
    try {
      const saved = localStorage.getItem(`express_user_orders_${phoneKey}`);
      if (saved) savedForPhone = JSON.parse(saved);
    } catch {}

    const allPhoneOrderIds = Array.from(new Set([...savedForPhone, ...matchingFromState]));
    setMyOrderIds(allPhoneOrderIds);
    try {
      localStorage.setItem(`express_user_orders_${phoneKey}`, JSON.stringify(allPhoneOrderIds));
    } catch {}

    // 3. Set or restore active order for this phone
    const activeOrd = orders.find(
      o => phonesMatch(o.customerPhone, cleanPhone) &&
      (o.status === 'SCHEDULED' || o.status === 'COOKING' || o.status === 'READY')
    );
    if (activeOrd) {
      setActiveOrderId(activeOrd.id);
      try {
        localStorage.setItem(`express_active_order_${phoneKey}`, activeOrd.id);
      } catch {}
    } else {
      const savedActiveId = localStorage.getItem(`express_active_order_${phoneKey}`);
      if (savedActiveId && allPhoneOrderIds.includes(savedActiveId)) {
        setActiveOrderId(savedActiveId);
      } else {
        setActiveOrderId(null);
      }
    }

    if (isAdminPhone(cleanPhone)) {
      setUserRole('admin');
      setActiveTab('admin');
      localStorage.setItem('express_user_role', 'admin');
    }
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

  // Sync active phone's order IDs
  useEffect(() => {
    if (!customerPhone) return;
    const phoneKey = normalizePhoneDigits(customerPhone);
    if (!phoneKey) return;
    try {
      localStorage.setItem(`express_user_orders_${phoneKey}`, JSON.stringify(myOrderIds));
    } catch {}
  }, [myOrderIds, customerPhone]);

  // Sync active phone's active order
  useEffect(() => {
    if (!customerPhone) return;
    const phoneKey = normalizePhoneDigits(customerPhone);
    if (!phoneKey) return;
    try {
      if (activeOrderId) {
        localStorage.setItem(`express_active_order_${phoneKey}`, activeOrderId);
      } else {
        localStorage.removeItem(`express_active_order_${phoneKey}`);
      }
    } catch {}
  }, [activeOrderId, customerPhone]);

  // Reactive synchronization: continuously link orders matching the user's phone
  useEffect(() => {
    if (!customerPhone) {
      setMyOrderIds([]);
      return;
    }
    const phoneKey = normalizePhoneDigits(customerPhone);
    if (!phoneKey) return;

    const matchingIds = orders
      .filter(o => isUserOrder(o, customerPhone, customerId, myOrderIds))
      .map(o => o.id);

    setMyOrderIds(prev => {
      const next = Array.from(new Set([...prev, ...matchingIds]));
      if (next.length !== prev.length) {
        try {
          localStorage.setItem(`express_user_orders_${phoneKey}`, JSON.stringify(next));
        } catch {}
        return next;
      }
      return prev;
    });
  }, [orders, customerPhone, customerId]);

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

          const phone = localStorage.getItem('express_customer_phone') || '';
          if (phone) {
            const phoneKey = normalizePhoneDigits(phone);
            const matching = loadedOrders
              .filter((o: Order) => phonesMatch(o.customerPhone, phone))
              .map((o: Order) => o.id);
            if (matching.length > 0 && phoneKey) {
              setMyOrderIds(prev => {
                const next = Array.from(new Set([...prev, ...matching]));
                try {
                  localStorage.setItem(`express_user_orders_${phoneKey}`, JSON.stringify(next));
                } catch {}
                return next;
              });
            }
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

            const phone = localStorage.getItem('express_customer_phone') || '';
            if (phone && phonesMatch(newOrder.customerPhone, phone)) {
              const phoneKey = normalizePhoneDigits(phone);
              if (phoneKey) {
                setMyOrderIds(prev => {
                  const next = Array.from(new Set([newOrder.id, ...prev]));
                  try {
                    localStorage.setItem(`express_user_orders_${phoneKey}`, JSON.stringify(next));
                  } catch {}
                  return next;
                });
              }
            }
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
    customerPhone: orderCustomerPhone,
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

    const effectivePhone = orderCustomerPhone?.trim() || customerPhone.trim();
    const phoneKey = effectivePhone ? normalizePhoneDigits(effectivePhone) : '';
    const effectiveCid = phoneKey ? ('usr_' + phoneKey) : customerId;

    const newOrder: Order = {
      id,
      orderNumber: orderNum,
      customerId: effectiveCid,
      customerName: customerName.trim() || (lang === 'kz' ? 'Әлихан' : lang === 'en' ? 'Alex' : 'Алихан'),
      customerPhone: effectivePhone || undefined,
      venueId: activeVenue?.id || 'venue_main',
      venueName: activeVenue?.name || venueName || 'Университетская столовая',
      items,
      totalAmount: total,
      requestedPickupTime: pickupTime,
      status: 'SCHEDULED',
      estimatedReadyTime: jit.estimatedReadyTime,
      scheduledFireTime: jit.scheduledFireTime,
      delayMinutes: 0,
      createdAt: Date.now()
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem('express_orders', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (effectivePhone) {
      linkCustomerPhone(effectivePhone);
    }

    setActiveOrderId(newOrder.id);
    if (phoneKey) {
      try {
        localStorage.setItem(`express_active_order_${phoneKey}`, newOrder.id);
        const saved = localStorage.getItem(`express_user_orders_${phoneKey}`);
        const existing: string[] = saved ? JSON.parse(saved) : [];
        const updatedIds = Array.from(new Set([newOrder.id, ...existing]));
        localStorage.setItem(`express_user_orders_${phoneKey}`, JSON.stringify(updatedIds));
        setMyOrderIds(updatedIds);
      } catch {}
    }

    if (supabase && isSupabaseConfigured) {
      const dbPayload = mapOrderToDb(newOrder);
      supabase.from('orders').insert(dbPayload).then(({ error }: { error: any }) => {
        if (error) console.error('Supabase createOrder error:', error.message);
      });
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
        isAdmin,
        adminPhone,
        inquiries,
        approvedKitchenPhones,
        approveInquiry,
        rejectInquiry,
        approveAllInquiries,
        deleteInquiry,
        enterAdminMode,
        lockAdmin,
        venues,
        addVenue,
        updateVenue,
        deleteVenue,
        toggleVenueActive,
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
        getStationName,
        venueName,
        setVenueName,
        selectedVenueId,
        setSelectedVenueId,
        activeVenue,
        allMenuItems,
        addMenuItem,
        deleteMenuItem,
        toggleMenuItemAvailability
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

