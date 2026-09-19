import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { timeStringToMinutes } from '../../engine/scheduler';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  BellRing,
  Layers,
  Pencil,
  Check,
  X,
  Plus,
  Trash2,
  UtensilsCrossed,
  ShieldCheck,
  Star,
  Leaf,
  Search,
  Store,
  AlertCircle
} from 'lucide-react';
import { AddDishModal } from './AddDishModal';

export const KitchenDashboard: React.FC = () => {
  const {
    orders,
    advanceOrderStatus,
    delayOrder,
    currentTimeStr,
    t,
    lang,
    venueName,
    setVenueName,
    venues,
    selectedVenueId,
    setSelectedVenueId,
    activeVenue,
    menuItems,
    deleteMenuItem,
    toggleMenuItemAvailability,
    getItemName,
    getItemDesc
  } = useApp();

  const [activeKitchenTab, setActiveKitchenTab] = useState<'orders' | 'menu'>('orders');
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [isEditingVenue, setIsEditingVenue] = useState(false);
  const [venueInput, setVenueInput] = useState(venueName || t.cafeteriaName);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [menuDietFilter, setMenuDietFilter] = useState<'all' | 'halal' | 'hit' | 'veg'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const scheduledOrders = orders.filter(o => o.status === 'SCHEDULED');
  const cookingOrders = orders.filter(o => o.status === 'COOKING');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const pickedUpOrders = orders.filter(o => o.status === 'PICKED_UP');

  const currentMins = timeStringToMinutes(currentTimeStr);
  const currentVenueName = venueName || t.cafeteriaName;

  const handleSaveVenueName = (e: React.FormEvent) => {
    e.preventDefault();
    if (venueInput.trim()) {
      setVenueName(venueInput.trim());
    }
    setIsEditingVenue(false);
  };

  const handleStartEditVenue = () => {
    setVenueInput(venueName || t.cafeteriaName);
    setIsEditingVenue(true);
  };

  const getStationLabel = (stationId: string) => {
    switch (stationId) {
      case 'grill':
        return lang === 'kz' ? 'Гриль-цех' : lang === 'en' ? 'Grill' : 'Гриль';
      case 'fryer':
        return lang === 'kz' ? 'Фритюрница' : lang === 'en' ? 'Fryer' : 'Фритюр';
      case 'oven':
        return lang === 'kz' ? 'Подовая печь' : lang === 'en' ? 'Oven' : 'Печь';
      case 'prep':
        return lang === 'kz' ? 'Суық цех' : lang === 'en' ? 'Cold Prep' : 'Холодный цех';
      case 'coffee':
        return lang === 'kz' ? 'Кофе-бар' : lang === 'en' ? 'Coffee Bar' : 'Кофе-бар';
      default:
        return stationId;
    }
  };

  // Filter menu items for management tab
  const filteredMenuItems = menuItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (menuDietFilter === 'halal' && !item.isHalal) return false;
    if (menuDietFilter === 'hit' && !item.isHit) return false;
    if (menuDietFilter === 'veg' && !item.isVegetarian) return false;

    if (menuSearchQuery.trim()) {
      const q = menuSearchQuery.toLowerCase();
      const name = (getItemName(item) || item.name).toLowerCase();
      const desc = (getItemDesc(item) || item.description).toLowerCase();
      return name.includes(q) || desc.includes(q);
    }
    return true;
  });

  const totalHalalCount = menuItems.filter(m => m.isHalal).length;
  const totalHitCount = menuItems.filter(m => m.isHit).length;
  const totalStopListCount = menuItems.filter(m => !m.isAvailable).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      {/* KDS Header & Venue Name & Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex-1">
          {isEditingVenue ? (
            <form onSubmit={handleSaveVenueName} className="flex items-center space-x-2 flex-wrap gap-y-2">
              <input
                type="text"
                value={venueInput}
                onChange={e => setVenueInput(e.target.value)}
                placeholder={t.cafeteriaName}
                className="px-3 py-1.5 text-base sm:text-lg font-black text-gray-900 border-2 border-orange-500 rounded-xl focus:outline-hidden"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                title="Сохранить"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'kz' ? 'Сақтау' : lang === 'en' ? 'Save' : 'Сохранить'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingVenue(false)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                title="Отмена"
              >
                <X className="w-4 h-4" />
                <span>{lang === 'kz' ? 'Бас тарту' : lang === 'en' ? 'Cancel' : 'Отмена'}</span>
              </button>
            </form>
          ) : (
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black">
                    <Store className="w-4 h-4" />
                  </div>
                  {venues.length > 1 ? (
                    <select
                      value={activeVenue?.id || selectedVenueId || ''}
                      onChange={e => {
                        const target = venues.find(v => v.id === e.target.value);
                        if (target) {
                          setVenueName(target.name);
                          setSelectedVenueId(target.id);
                        }
                      }}
                      className="text-base sm:text-lg font-black text-gray-900 bg-white border border-gray-300 rounded-xl px-2.5 py-1 focus:outline-none focus:border-orange-500 cursor-pointer shadow-2xs"
                    >
                      {venues.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.name} {v.isPrimary ? '(Основная)' : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">
                      {currentVenueName}
                    </h1>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleStartEditVenue}
                  className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                  title={lang === 'kz' ? 'Атауын өзгерту' : lang === 'en' ? 'Edit venue name' : 'Изменить название заведения'}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t.liveBadge}</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'kz'
                  ? 'Асхананы басқару: тапсырыстар кезектемесі мен тағамдар мәзірі'
                  : lang === 'en'
                  ? 'Kitchen Terminal: Real-time order expediting & menu management'
                  : 'Терминал кухни: оперативное управление заказами и меню заведения'}
              </p>
            </div>
          )}
        </div>

        {/* Tab Switcher & Quick Add Dish Button */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold">
            <button
              onClick={() => setActiveKitchenTab('orders')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeKitchenTab === 'orders'
                  ? 'bg-white text-gray-900 shadow-2xs font-black'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>{lang === 'kz' ? 'Тапсырыстар' : lang === 'en' ? 'KDS Orders' : 'Заказы KDS'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeKitchenTab === 'orders' ? 'bg-orange-100 text-orange-700 font-extrabold' : 'bg-gray-200 text-gray-600'
              }`}>
                {scheduledOrders.length + cookingOrders.length + readyOrders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveKitchenTab('menu')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeKitchenTab === 'menu'
                  ? 'bg-white text-gray-900 shadow-2xs font-black'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>{lang === 'kz' ? 'Мәзірді басқару' : lang === 'en' ? 'Manage Menu' : 'Меню заведения'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeKitchenTab === 'menu' ? 'bg-orange-100 text-orange-700 font-extrabold' : 'bg-gray-200 text-gray-600'
              }`}>
                {menuItems.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsAddDishModalOpen(true)}
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white rounded-xl text-xs font-black shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'kz' ? 'Жаңа тағам қосу' : lang === 'en' ? 'Add Dish' : 'Добавить новое блюдо'}</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: KDS ORDERS ================= */}
      {activeKitchenTab === 'orders' && (
        <>
          {/* Quick Metric Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">{scheduledOrders.length}</div>
                <div className="text-[11px] font-semibold text-gray-500">{t.colScheduled}</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-black">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">{cookingOrders.length}</div>
                <div className="text-[11px] font-semibold text-gray-500">{t.colCooking}</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">{readyOrders.length}</div>
                <div className="text-[11px] font-semibold text-gray-500">{t.colReady}</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">{pickedUpOrders.length}</div>
                <div className="text-[11px] font-semibold text-gray-500">{lang === 'kz' ? 'Берілген' : lang === 'en' ? 'Completed' : 'Выдано'}</div>
              </div>
            </div>
          </div>

          {/* 3-Column Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* COL 1: SCHEDULED */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
                  {t.colScheduled} ({scheduledOrders.length})
                </h2>
                <span className="text-[10px] text-gray-400 font-mono">{t.autoFires}</span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {scheduledOrders.length === 0 ? (
                  <div className="p-6 bg-white rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-400">{t.emptyScheduled}</div>
                ) : (
                  scheduledOrders.map(order => {
                    const fireMins = timeStringToMinutes(order.scheduledFireTime);
                    const isTimeToFire = currentMins >= fireMins;

                    return (
                      <div
                        key={order.id}
                        className={`rounded-2xl p-4 shadow-2xs space-y-3 transition-all ${
                          isTimeToFire
                            ? 'bg-amber-50/70 border-2 border-amber-500 shadow-sm'
                            : 'bg-white border border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-black font-mono text-gray-900">#{order.orderNumber}</span>
                              {isTimeToFire && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-orange-600 text-white animate-pulse">
                                  {lang === 'kz' ? 'Бастау уақыты' : lang === 'en' ? 'Fire Now' : 'Пора начинать'}
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-semibold text-gray-700">{order.customerName}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              {t.targetPickupTime} {order.requestedPickupTime}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-0.5 font-mono">
                              {t.fireJitTime}: <strong className={isTimeToFire ? 'text-orange-700 font-extrabold' : ''}>{order.scheduledFireTime}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-2 space-y-1">
                          {order.items.map((i, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-gray-700">
                              <span>{i.quantity}x {i.name}</span>
                              <span className="text-[10px] font-bold uppercase text-gray-400">{i.station} ({i.prepMinutes}m)</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => advanceOrderStatus(order.id)}
                          className={`w-full font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center space-x-1 active:scale-98 cursor-pointer ${
                            isTimeToFire
                              ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          <span>{t.startCookingBtn}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COL 2: COOKING */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-orange-700 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-orange-600 mr-2 animate-pulse" />
                  {t.colCooking} ({cookingOrders.length})
                </h2>
                <span className="text-[10px] text-orange-600 font-bold">{t.activeSlots}</span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {cookingOrders.length === 0 ? (
                  <div className="p-6 bg-white rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-400">{t.emptyCooking}</div>
                ) : (
                  cookingOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl border-2 border-orange-400 p-4 shadow-sm space-y-3 relative">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xl font-black font-mono text-gray-900">#{order.orderNumber}</span>
                          <div className="text-xs font-bold text-gray-800">{order.customerName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">{order.requestedPickupTime}</div>
                          {order.delayMinutes > 0 && <div className="text-[10px] text-red-600 font-bold mt-0.5">{t.delayedBy} +{order.delayMinutes}m</div>}
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-2 space-y-1">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-gray-900 font-medium">
                            <span>{i.quantity}x {i.name}</span>
                            <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">{i.station.toUpperCase()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-1 flex flex-col space-y-2">
                        <button onClick={() => advanceOrderStatus(order.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center space-x-1 shadow-xs cursor-pointer">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.markReadyBtn}</span>
                        </button>
                        <button onClick={() => delayOrder(order.id, 5, 'Kitchen load surge')} className="w-full bg-amber-50 hover:bg-amber-100 active:scale-98 text-amber-800 border border-amber-300 font-bold py-1.5 rounded-xl text-[11px] transition-all flex items-center justify-center space-x-1 cursor-pointer">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{t.delay5mBtn}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COL 3: READY */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2" />
                  {t.colReady} ({readyOrders.length})
                </h2>
                <span className="text-[10px] text-emerald-600 font-bold">{t.awaitingScan}</span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {readyOrders.length === 0 ? (
                  <div className="p-6 bg-white rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-400">{t.emptyReady}</div>
                ) : (
                  readyOrders.map(order => (
                    <div key={order.id} className="bg-emerald-50/50 rounded-2xl border-2 border-emerald-500 p-4 shadow-sm space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xl font-black font-mono text-emerald-950">#{order.orderNumber}</span>
                          <div className="text-xs font-bold text-gray-800">{order.customerName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-white bg-emerald-700 px-2.5 py-1 rounded-lg shadow-2xs">{order.shelfBay}</div>
                          <div className="text-[10px] text-emerald-800 font-medium mt-1">{order.requestedPickupTime}</div>
                        </div>
                      </div>

                      <div className="border-t border-emerald-100 pt-2 text-xs text-gray-700 space-y-0.5">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{i.quantity}x {i.name}</span>
                          </div>
                        ))}
                      </div>

                      <button onClick={() => advanceOrderStatus(order.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
                        <span>{t.completeHandoverBtn}</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {pickedUpOrders.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.telemetryTitle}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {pickedUpOrders.slice(0, 4).map(ord => (
                  <div key={ord.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                    <div className="flex justify-between font-mono font-bold text-gray-900">
                      <span>#{ord.orderNumber}</span>
                      <span className="text-emerald-700">{ord.customerName}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      {t.measuredDwell} <strong>{ord.actualWaitTimeSeconds || 74}s</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= TAB 2: MENU MANAGEMENT ================= */}
      {activeKitchenTab === 'menu' && (
        <div className="space-y-5">
          {/* Quick Metrics & Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-black">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">{menuItems.length}</div>
                <div className="text-[11px] font-semibold text-gray-500">
                  {lang === 'kz' ? 'Барлық тағамдар' : lang === 'en' ? 'Total Dishes' : 'Всего блюд в меню'}
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">{totalHalalCount}</div>
                <div className="text-[11px] font-semibold text-gray-500">
                  {lang === 'kz' ? 'Халал позициялар' : lang === 'en' ? 'Halal Items' : 'Халяль позиции'}
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">{totalHitCount}</div>
                <div className="text-[11px] font-semibold text-gray-500">
                  {lang === 'kz' ? 'Хит тағамдар' : lang === 'en' ? 'Bestsellers' : 'Хиты продаж'}
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">{totalStopListCount}</div>
                <div className="text-[11px] font-semibold text-gray-500">
                  {lang === 'kz' ? 'Стоп-парақшада' : lang === 'en' ? 'Stop-List' : 'В стоп-листе'}
                </div>
              </div>
            </div>
          </div>

          {/* Filtering & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={menuSearchQuery}
                  onChange={e => setMenuSearchQuery(e.target.value)}
                  placeholder={lang === 'kz' ? 'Тағамды іздеу...' : lang === 'en' ? 'Search dishes...' : 'Поиск блюда по названию...'}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:border-orange-500 transition-all"
                />
              </div>

              {/* Criteria Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] font-bold">
                <button
                  onClick={() => setMenuDietFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    menuDietFilter === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {lang === 'kz' ? 'Барлығы' : lang === 'en' ? 'All' : 'Все'}
                </button>
                <button
                  onClick={() => setMenuDietFilter('halal')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer ${
                    menuDietFilter === 'halal'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Халяль</span>
                </button>
                <button
                  onClick={() => setMenuDietFilter('hit')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer ${
                    menuDietFilter === 'hit'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Хит</span>
                </button>
                <button
                  onClick={() => setMenuDietFilter('veg')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer ${
                    menuDietFilter === 'veg'
                      ? 'bg-green-700 text-white'
                      : 'bg-green-50 text-green-800 hover:bg-green-100'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Вегетариан</span>
                </button>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto border-t border-gray-100 pt-3 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {lang === 'kz' ? 'Барлық санаттар' : lang === 'en' ? 'All Categories' : 'Все категории'}
              </button>
              <button
                onClick={() => setSelectedCategory('Burgers & Mains')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedCategory === 'Burgers & Mains'
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {lang === 'kz' ? 'Ыстық тағамдар' : 'Горячие блюда и бургеры'}
              </button>
              <button
                onClick={() => setSelectedCategory('Pizzas')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedCategory === 'Pizzas'
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {lang === 'kz' ? 'Пицца' : 'Пицца и выпечка'}
              </button>
              <button
                onClick={() => setSelectedCategory('Sides & Snacks')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedCategory === 'Sides & Snacks'
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {lang === 'kz' ? 'Жеңіл тағамдар' : 'Закуски и гарниры'}
              </button>
              <button
                onClick={() => setSelectedCategory('Drinks')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedCategory === 'Drinks'
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {lang === 'kz' ? 'Сусындар' : 'Напитки и кофе'}
              </button>
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Quick Add Card */}
            <button
              onClick={() => setIsAddDishModalOpen(true)}
              className="border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/30 hover:bg-orange-50/70 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 transition-all min-h-[260px] group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-500 group-hover:bg-orange-600 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-110">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-gray-900 group-hover:text-orange-600 transition-colors">
                  {lang === 'kz' ? 'Жаңа тағам қосу' : lang === 'en' ? 'Add New Dish' : 'Добавить новое блюдо'}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  {lang === 'kz' ? 'Халал, баға, дайындалу уақыты мен суретін енгізу' : lang === 'en' ? 'Set criteria, halal, timing and photo' : 'Критерии, халяль, цех, фото и цена'}
                </div>
              </div>
            </button>

            {/* Menu Items Cards */}
            {filteredMenuItems.map(item => {
              const localizedName = getItemName(item) || item.name;
              const localizedDesc = getItemDesc(item) || item.description;
              const isDeleting = deleteConfirmId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-xs ${
                    item.isAvailable ? 'border-gray-200' : 'border-gray-300 opacity-75 bg-gray-50/60'
                  }`}
                >
                  <div>
                    {/* Image & Badge Overlay */}
                    <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={localizedName}
                        className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
                          !item.isAvailable ? 'grayscale-50' : ''
                        }`}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />

                      {/* Criteria Badges */}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {item.isHalal && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-700 text-white flex items-center space-x-1 shadow-2xs">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Халяль</span>
                          </span>
                        )}
                        {item.isHit && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500 text-white flex items-center space-x-1 shadow-2xs">
                            <Star className="w-3 h-3" />
                            <span>Хит</span>
                          </span>
                        )}
                        {item.isVegetarian && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-green-700 text-white flex items-center space-x-1 shadow-2xs">
                            <Leaf className="w-3 h-3" />
                            <span>Вег</span>
                          </span>
                        )}
                      </div>

                      {/* Availability status badge */}
                      <div className="absolute top-2 right-2">
                        {item.isAvailable ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            В наличии
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-300">
                            Стоп-лист
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3.5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-black text-gray-900 leading-snug">
                          {localizedName}
                        </h3>
                        <div className="text-sm font-black text-orange-600 whitespace-nowrap">
                          {item.price.toLocaleString('ru-RU')} ₸
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {localizedDesc}
                      </p>

                      {/* Meta badges: station, time, kcal */}
                      <div className="flex items-center flex-wrap gap-1.5 pt-1 text-[10px] font-semibold text-gray-500">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md uppercase font-bold text-gray-700">
                          {getStationLabel(item.station)}
                        </span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md flex items-center space-x-0.5">
                          <Clock className="w-2.5 h-2.5 mr-1" />
                          <span>{item.prepMinutes} мин</span>
                        </span>
                        {item.calories && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">
                            {item.calories} ккал
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-3.5 border-t border-gray-100 bg-gray-50/50 space-y-2">
                    {isDeleting ? (
                      <div className="p-2 bg-red-50 rounded-xl border border-red-200 text-center space-y-1.5">
                        <div className="text-[11px] font-bold text-red-800">
                          {lang === 'kz' ? 'Өшіруді растайсыз ба?' : 'Удалить это блюдо из меню?'}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              deleteMenuItem(item.id);
                              setDeleteConfirmId(null);
                            }}
                            className="flex-1 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Да, удалить
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="flex-1 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {/* Toggle availability button */}
                        <button
                          onClick={() => toggleMenuItemAvailability(item.id)}
                          className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                            item.isAvailable
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-emerald-600' : 'bg-gray-400'}`} />
                          <span>{item.isAvailable ? 'В наличии' : 'В стоп-листе'}</span>
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-200"
                          title={lang === 'kz' ? 'Тағамды өшіру' : 'Удалить блюдо'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMenuItems.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 space-y-3">
              <UtensilsCrossed className="w-10 h-10 text-gray-400 mx-auto" />
              <div className="text-sm font-bold text-gray-700">
                {menuItems.length === 0
                  ? (lang === 'kz' ? 'Бұл асханада әзірге мәзір бос. Алғашқы тағамды қосыңыз.' : 'В этом заведении пока нет блюд. Добавьте первую позицию для меню этой столовой.')
                  : (lang === 'kz' ? 'Сүзгілерге сәйкес келетін тағамдар табылмады' : 'Блюда по выбранным критериям не найдены')}
              </div>
              {menuItems.length === 0 ? (
                <button
                  onClick={() => setIsAddDishModalOpen(true)}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-xs inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'kz' ? 'Тағам қосу' : 'Добавить первое блюдо'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMenuDietFilter('all');
                    setMenuSearchQuery('');
                  }}
                  className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal for Adding New Dishes */}
      <AddDishModal
        isOpen={isAddDishModalOpen}
        onClose={() => setIsAddDishModalOpen(false)}
        onDishAdded={() => {
          setActiveKitchenTab('menu');
        }}
      />
    </div>
  );
};
