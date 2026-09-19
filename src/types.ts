import { Language } from './i18n/translations';

export type StationId = 'grill' | 'fryer' | 'oven' | 'prep' | 'coffee';

export interface Station {
  id: StationId;
  name: string;
  nameKz: string;
  nameRu: string;
  nameEn: string;
  capacity: number;
  currentOccupied: number;
}

export type FoodCategory = 'Burgers & Mains' | 'Pizzas' | 'Sides & Snacks' | 'Drinks';

export interface MenuItem {
  id: string;
  name: string;
  nameKz: string;
  nameRu: string;
  nameEn: string;
  description: string;
  descKz: string;
  descRu: string;
  descEn: string;
  price: number; // KZT
  prepMinutes: number;
  calories: number; // kcal
  station: StationId;
  category: FoodCategory;
  imageUrl: string;
  isAvailable: boolean;
  isHalal?: boolean;
  isVegetarian?: boolean;
  isHit?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = 'SCHEDULED' | 'COOKING' | 'READY' | 'PICKED_UP' | 'CANCELLED';

export interface OrderItemRecord {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  prepMinutes: number;
  station: StationId;
}

export type UserRole = 'customer' | 'kitchen' | 'admin';

export interface Order {
  id: string;
  orderNumber: string; // "184"
  customerId?: string; // unique device/account ID
  customerName: string;
  customerPhone?: string;
  items: OrderItemRecord[];
  totalAmount: number;
  requestedPickupTime: string; // "12:45"
  status: OrderStatus;
  estimatedReadyTime: string; // "12:44"
  scheduledFireTime: string; // "12:33"
  shelfBay?: string; // "Shelf A2"
  delayMinutes: number; // 5
  delayReason?: string;
  createdAt: number;
  cookingStartedAt?: number;
  readyAt?: number;
  pickedUpAt?: number;
  actualWaitTimeSeconds?: number;
}

export type SlotStatus = 'AVAILABLE' | 'TIGHT' | 'FULL';

export interface TimeSlotOption {
  time: string; // "12:45"
  status: SlotStatus;
  label: string;
  stationLoadDescription: string;
  canAccept: boolean;
}

export interface SimulationMetrics {
  totalArrivals: number;
  completedOrders: number;
  abandonedOrders: number;
  averageWaitMinutes: number;
  peakQueueLength: number;
  kitchenUtilizationPercent: number;
  cashierQueuePeak: number;
}

export interface SimulationResult {
  traditional: SimulationMetrics;
  express: SimulationMetrics;
  throughputIncreasePercent: number;
  waitTimeReductionPercent: number;
}
