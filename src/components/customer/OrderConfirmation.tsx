import React, { useState } from 'react';
import { useApp, isUserOrder } from '../../context/AppContext';
import { ArrowLeft, AlertTriangle, QrCode, Clock, Sparkles, Receipt, MessageSquare, ShoppingBag } from 'lucide-react';
import { timeStringToMinutes } from '../../engine/scheduler';
import { ReceiptCardModal } from './ReceiptCardModal';
import { WhatsAppPhotoModal } from './WhatsAppPhotoModal';
import { Order } from '../../types';

export const OrderConfirmation: React.FC = () => {
  const {
    orders,
    activeOrderId,
    setCustomerStep,
    cancelOrder,
    currentDate,
    t,
    lang,
    customerPhone,
    customerId,
    myOrderIds
  } = useApp();

  const [showReceipt, setShowReceipt] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const userOrders = orders.filter(o => isUserOrder(o, customerPhone, customerId, myOrderIds));
  let order = userOrders.find(o => o.id === activeOrderId);

  if (!order && userOrders.length > 0) {
    const activeOne = userOrders.find(o => o.status === 'SCHEDULED' || o.status === 'COOKING' || o.status === 'READY');
    order = activeOne || userOrders[0];
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">
            {lang === 'kz' ? 'Белсенді тапсырыс табылмады' : lang === 'en' ? 'No active order found' : 'Нет активного заказа'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'kz' ? 'Мәзірден жаңа тапсырыс бере аласыз.' : lang === 'en' ? 'You can place a new order from the menu.' : 'Вы можете оформить заказ из меню блюд.'}
          </p>
        </div>
        <button
          onClick={() => setCustomerStep('menu')}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          {t.backToMenu}
        </button>
      </div>
    );
  }

  const isScheduled = order.status === 'SCHEDULED';
  const isCooking = order.status === 'COOKING';
  const isReady = order.status === 'READY';
  const isPickedUp = order.status === 'PICKED_UP';
  const isCancelled = order.status === 'CANCELLED';

  // Live countdown calculation
  const pickupMins = timeStringToMinutes(order.requestedPickupTime) + (order.delayMinutes || 0);
  const currentTotalSecs = currentDate.getHours() * 3600 + currentDate.getMinutes() * 60 + currentDate.getSeconds();
  const targetTotalSecs = pickupMins * 60;
  const remainingSecs = Math.max(0, targetTotalSecs - currentTotalSecs);
  const remMins = Math.floor(remainingSecs / 60);
  const remSecs = remainingSecs % 60;

  // WhatsApp share message
  const shareText = t.shareWhatsAppText
    .replace('{orderNum}', order.orderNumber)
    .replace('{time}', order.requestedPickupTime)
    .replace('{bay}', order.shelfBay || (isReady ? 'Полка A1' : 'Зона выдачи'));
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleCancel = () => {
    if (confirm(t.confirmCancelPrompt)) {
      const ok = cancelOrder(order.id);
      if (!ok) {
        alert(t.cancelBlockedNote);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5 pb-24">

      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <button
          onClick={() => setCustomerStep('menu')}
          className="flex items-center space-x-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToMenu}</span>
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCustomerStep('history')}
            className="flex items-center space-x-1 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200 transition-all"
          >
            <Receipt className="w-3.5 h-3.5 text-orange-600" />
            <span>{t.myOrders}</span>
          </button>
          <span className="text-xs font-mono font-bold text-gray-500">#{order.orderNumber}</span>
        </div>
      </div>

      {order.delayMinutes > 0 && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-3.5 text-amber-900 shadow-sm flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-bold">{t.delayAlertTitle}</div>
            <p className="text-amber-800 mt-0.5 leading-relaxed">
              {t.delayAlertDesc}{' '}
              <strong className="font-extrabold text-amber-950">
                {order.requestedPickupTime} (+{order.delayMinutes}m)
              </strong>.
            </p>
          </div>
        </div>
      )}

      {/* Main Order Status Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4 text-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.orderNumberLabel}</span>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mt-0.5">#{order.orderNumber}</h2>
          <p className="text-xs text-gray-600 font-medium mt-1">{t.customerLabel}: {order.customerName}</p>
        </div>

        {/* Live Countdown Timer Badge */}
        {!isPickedUp && !isCancelled && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-3 text-center">
            {isReady ? (
              <div className="flex items-center justify-center space-x-1.5 text-emerald-700 font-black text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t.countdownReady}</span>
              </div>
            ) : (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-orange-800 flex items-center justify-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>{t.countdownPrefix}</span>
                </div>
                <div className="text-2xl font-black font-mono text-orange-950 mt-0.5 tracking-tight">
                  {String(remMins).padStart(2, '0')} {t.countdownMins} {String(remSecs).padStart(2, '0')} {t.countdownSecs}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  {t.targetPickupTime}: <strong>{order.requestedPickupTime}</strong>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          {isScheduled && <span className="text-blue-700 bg-blue-100 px-3 py-1 rounded-full">{t.statusScheduled} ({order.requestedPickupTime})</span>}
          {isCooking && <span className="text-orange-700 bg-orange-100 px-3 py-1 rounded-full animate-pulse">{t.statusCooking}</span>}
          {isReady && <span className="text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">{t.statusReady} ({order.shelfBay})</span>}
          {isPickedUp && <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-full">{t.statusPickedUp}</span>}
          {isCancelled && <span className="text-red-700 bg-red-100 px-3 py-1 rounded-full">{t.statusCancelled}</span>}
        </div>

        {/* 3 Steps Visual Timeline */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-semibold">
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-emerald-500" />
            <div className="text-gray-900">{t.stepScheduled}</div>
          </div>
          <div className="space-y-1">
            <div className={`h-1.5 rounded-full ${isCooking || isReady || isPickedUp ? 'bg-orange-500' : 'bg-gray-200'}`} />
            <div className={isCooking || isReady || isPickedUp ? 'text-gray-900' : 'text-gray-400'}>{t.stepCooking}</div>
          </div>
          <div className="space-y-1">
            <div className={`h-1.5 rounded-full ${isReady || isPickedUp ? 'bg-emerald-600' : 'bg-gray-200'}`} />
            <div className={isReady || isPickedUp ? 'text-gray-900' : 'text-gray-400'}>{t.stepReady}</div>
          </div>
        </div>

        {isReady && (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-3 text-emerald-900">
            <div className="text-3xl font-black text-emerald-800 tracking-tight">
              {order.shelfBay || 'Полка A1'}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              {lang === 'kz' ? 'Тапсырыс дайын, сөреден алып кетіңіз' : lang === 'en' ? 'Order is ready for pickup' : 'Заказ готов к выдаче'}
            </div>
          </div>
        )}

        <div className="space-y-2 pt-1">
          {/* Direct WhatsApp Photo Sender Modal */}
          <button
            onClick={() => setShowWhatsAppModal(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black py-3.5 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>{t.sharePhotoWhatsApp}</span>
          </button>

          {(isReady || isCooking || isScheduled) && (
            <button
              onClick={() => setCustomerStep('ready')}
              className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold py-3 px-4 rounded-xl shadow-xs transition-all text-xs flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{t.openPasscardBtn}</span>
            </button>
          )}

          {/* View Boarding Pass Modal */}
          <button
            onClick={() => setShowReceipt(true)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center space-x-2 border border-gray-200"
          >
            <Receipt className="w-3.5 h-3.5 text-orange-600" />
            <span>{t.viewReceipt}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2 text-xs">
        <div className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">{t.orderDetailsTitle}</div>
        <div className="space-y-1 divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-1.5 flex justify-between">
              <span className="font-medium text-gray-800">{item.quantity}x {item.name}</span>
              <span className="text-gray-500 font-mono">{(item.unitPrice * item.quantity).toLocaleString()} {t.priceKzt}</span>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-gray-100 flex justify-between font-extrabold text-sm">
          <span>{t.total}</span>
          <span>{order.totalAmount.toLocaleString()} {t.priceKzt}</span>
        </div>
      </div>

      <div className="text-center pt-2">
        {isScheduled ? (
          <button
            onClick={handleCancel}
            className="text-xs text-red-600 hover:text-red-800 font-semibold underline underline-offset-4"
          >
            {t.cancelScheduledBtn}
          </button>
        ) : isCooking ? (
          <p className="text-[11px] text-gray-400">
            {t.cancelBlockedNote}
          </p>
        ) : null}
      </div>

      {/* WhatsApp Photo Sender Modal */}
      <WhatsAppPhotoModal
        order={order}
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />

      {/* Photo Receipt Modal */}
      <ReceiptCardModal
        order={order}
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
      />
    </div>
  );
};
