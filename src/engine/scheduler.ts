import { CartItem, Order, Station, StationId, TimeSlotOption } from '../types';
import { Language } from '../i18n/translations';

export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 750; // default 12:30
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function minutesToTimeString(minutes: number): string {
  const normMins = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(normMins / 60);
  const m = normMins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export interface JITSchedule {
  scheduledFireTime: string;
  estimatedReadyTime: string;
  itemFireTimes: { menuItemId: string; name: string; station: StationId; fireTime: string }[];
}

export function calculateJITSchedule(requestedPickupTime: string, cartItems: CartItem[]): JITSchedule {
  const pickupMins = timeStringToMinutes(requestedPickupTime);
  const readyMins = pickupMins - 2; // finish 2 minutes before customer arrives

  let earliestFireMins = readyMins;
  const itemFireTimes = cartItems.map(({ menuItem }) => {
    const fireMins = readyMins - menuItem.prepMinutes;
    if (fireMins < earliestFireMins) {
      earliestFireMins = fireMins;
    }
    return {
      menuItemId: menuItem.id,
      name: menuItem.name,
      station: menuItem.station,
      fireTime: minutesToTimeString(fireMins)
    };
  });

  return {
    scheduledFireTime: minutesToTimeString(earliestFireMins),
    estimatedReadyTime: minutesToTimeString(readyMins),
    itemFireTimes
  };
}

export function calculateAvailableSlots(
  baseTimeStr: string,
  cartItems: CartItem[],
  existingOrders: Order[],
  _stations?: Station[],
  lang: Language = 'ru'
): TimeSlotOption[] {
  if (!cartItems || cartItems.length === 0) return [];

  const baseMinutes = timeStringToMinutes(baseTimeStr);
  const maxPrepMinutes = Math.max(...cartItems.map(c => c.menuItem.prepMinutes), 4);
  
  // Earliest possible pickup: base time + prep time + 2 min buffer, rounded to 5-min
  const rawMinPickup = baseMinutes + maxPrepMinutes + 2;
  const firstSlotMinutes = Math.ceil(rawMinPickup / 5) * 5;

  const slots: TimeSlotOption[] = [];

  // Generate slots for next 60 minutes in 5-minute increments (12 slots)
  for (let slotMins = firstSlotMinutes; slotMins <= firstSlotMinutes + 60; slotMins += 5) {
    const slotTimeStr = minutesToTimeString(slotMins);

    // Count existing active orders for this specific pickup slot
    const ordersInSlot = existingOrders.filter(
      o => o.requestedPickupTime === slotTimeStr && o.status !== 'PICKED_UP' && o.status !== 'CANCELLED'
    ).length;

    let status: 'AVAILABLE' | 'TIGHT' | 'FULL' = 'AVAILABLE';
    let label = '';
    let loadDesc = '';
    let canAccept = true;

    if (ordersInSlot >= 25) {
      status = 'FULL';
      canAccept = false;
      label = lang === 'kz' ? 'Толған' : lang === 'en' ? 'Full' : 'Занято';
      loadDesc = lang === 'kz'
        ? 'Слот толды · Келесі уақытты таңдаңыз'
        : lang === 'en'
        ? 'Slot full · Please select adjacent time'
        : 'Слот заполнен · Выберите соседнее время';
    } else if (ordersInSlot >= 15) {
      status = 'TIGHT';
      canAccept = true;
      label = lang === 'kz' ? 'Қарбалас' : lang === 'en' ? 'Peak' : 'Пик';
      loadDesc = lang === 'kz'
        ? 'Пиктік уақыт · Жоғары сұраныс'
        : lang === 'en'
        ? 'Peak rush · Limited capacity'
        : 'Пиковое время · Высокий спрос';
    } else {
      status = 'AVAILABLE';
      canAccept = true;
      label = lang === 'kz' ? 'Бос' : lang === 'en' ? 'Ideal' : 'Свободно';
      loadDesc = lang === 'kz'
        ? 'Бос слот · Уақытында дайын болады'
        : lang === 'en'
        ? 'Available · On-time guaranteed'
        : 'Свободный слот · Выдача вовремя';
    }

    slots.push({
      time: slotTimeStr,
      status,
      label,
      stationLoadDescription: loadDesc,
      canAccept
    });
  }

  return slots;
}
