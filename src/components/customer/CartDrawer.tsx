import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAvailableSlots } from '../../engine/scheduler';
import { ArrowLeft, Clock, Shield, Plus, Minus, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    orders,
    stations,
    currentTimeStr,
    createOrder,
    setActiveOrderId,
    setCustomerStep,
    updateCartQuantity,
    getItemName,
    t,
    lang
  } = useApp();

  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>(lang === 'kz' ? 'Әлихан' : lang === 'en' ? 'Alex' : 'Алихан');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  // If cart is empty, show empty cart fallback
  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">
          {lang === 'kz' ? 'Себет бос' : lang === 'en' ? 'Your cart is empty' : 'Корзина пуста'}
        </h2>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          {lang === 'kz' ? 'Тапсырыс беру үшін мәзірден тағамдарды таңдаңыз.' : lang === 'en' ? 'Please add food items from the menu before selecting a pickup slot.' : 'Пожалуйста, выберите блюда из меню перед выбором времени получения.'}
        </p>
        <button
          onClick={() => setCustomerStep('menu')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-xs"
        >
          {t.backToMenu}
        </button>
      </div>
    );
  }

  const slots = calculateAvailableSlots(currentTimeStr, cart, orders, stations, lang);

  React.useEffect(() => {
    if (!selectedSlot && slots.length > 0) {
      const firstAvailable = slots.find(s => s.canAccept);
      if (firstAvailable) {
        setSelectedSlot(firstAvailable.time);
      }
    }
  }, [slots, selectedSlot]);

  const totalAmount = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const totalCalories = cart.reduce((sum, item) => sum + (item.menuItem.calories || 0) * item.quantity, 0);
  const maxPrepTime = Math.max(...cart.map(c => c.menuItem.prepMinutes), 5);

  const handleConfirmOrder = () => {
    if (!selectedSlot) return;
    setOrderSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        customerName: customerName || (lang === 'kz' ? 'Студент' : lang === 'en' ? 'Student' : 'Студент'),
        customerPhone,
        pickupTime: selectedSlot
      });
      if (newOrder && newOrder.id) {
        setActiveOrderId(newOrder.id);
      }
      setOrderSubmitting(false);
      setCustomerStep('tracking');
    }, 250);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <button
          onClick={() => setCustomerStep('menu')}
          className="flex items-center space-x-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-gray-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToMenu}</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          {t.step2Title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Order Summary & Identity */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-xs">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t.orderSummary}</div>
            <div className="space-y-2.5 divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
              {cart.map(ci => (
                <div key={ci.menuItem.id} className="pt-2.5 flex items-center justify-between text-xs">
                  <div className="flex-1 pr-2">
                    <span className="font-bold text-gray-900 leading-snug">
                      {getItemName(ci.menuItem)}
                    </span>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {ci.menuItem.calories ? `${ci.menuItem.calories} ${t.kcal} · ` : ''}{ci.menuItem.price.toLocaleString()} {t.priceKzt} × {ci.quantity}
                    </div>
                  </div>

                  {/* Quantity Stepper inside cart */}
                  <div className="flex items-center space-x-2 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                    <button
                      onClick={() => updateCartQuantity(ci.menuItem.id, -1)}
                      className="w-5 h-5 rounded bg-white text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center text-[10px] shadow-2xs cursor-pointer"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="font-bold text-xs font-mono w-3 text-center">
                      {ci.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(ci.menuItem.id, 1)}
                      className="w-5 h-5 rounded bg-orange-600 text-white font-bold hover:bg-orange-700 flex items-center justify-center text-[10px] shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <span className="font-black text-gray-900 tabular-nums w-16 text-right">
                    {(ci.menuItem.price * ci.quantity).toLocaleString()} {t.priceKzt}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline text-sm font-extrabold text-gray-900">
              <div className="flex items-center space-x-1.5">
                <span>{t.total}</span>
                {totalCalories > 0 && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {totalCalories} {t.kcal}
                  </span>
                )}
              </div>
              <span className="text-xl font-black text-orange-600 tabular-nums">
                {totalAmount.toLocaleString()} {t.priceKzt}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-xs">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {t.step3Title}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                {t.nameInputLabel}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder={t.nameInputPlaceholder}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                {t.phoneInputLabel}
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="+7 (777) 000-0000"
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="text-[10px] text-gray-500 flex items-center pt-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600 mr-1 flex-shrink-0" />
              <span>{t.zeroFrictionNote}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Pickup Time Slots Selection & Confirm */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-orange-600" />
                {t.selectSlotHeader}
              </label>
              <span className="text-[11px] text-gray-500 font-medium">{t.prepEst}: ~{maxPrepTime} {t.minAbbr}</span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              {t.slotDesc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {slots.map(slot => {
                const isSelected = selectedSlot === slot.time;
                const isFull = slot.status === 'FULL';
                const isTight = slot.status === 'TIGHT';

                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all relative cursor-pointer ${
                      isFull
                        ? 'border-red-200 bg-red-50/50 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'border-orange-600 bg-orange-50 shadow-xs'
                        : isTight
                        ? 'border-amber-200 bg-white hover:border-amber-400'
                        : 'border-emerald-200 bg-white hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base tabular-nums text-gray-900">
                        {slot.time}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          isFull
                            ? 'bg-red-200 text-red-800'
                            : isTight
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isFull ? t.slotFull : isTight ? t.slotPeak : t.slotIdeal}
                      </span>
                    </div>

                    <div className="text-[10px] mt-1 text-gray-500 leading-tight font-medium">
                      {slot.stationLoadDescription}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!selectedSlot || orderSubmitting}
              onClick={handleConfirmOrder}
              className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer mt-4"
            >
              <span>
                {orderSubmitting ? t.reservingSlot : `${t.confirmOrderBtn} (${selectedSlot} · ${totalAmount.toLocaleString()} ${t.priceKzt})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
