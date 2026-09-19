import React, { useState } from 'react';
import { useApp, isUserOrder } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, MapPin, Receipt, MessageSquare } from 'lucide-react';
import { ReceiptCardModal } from './ReceiptCardModal';
import { WhatsAppPhotoModal } from './WhatsAppPhotoModal';

export const ReadyPasscard: React.FC = () => {
  const { orders, activeOrderId, setCustomerStep, t, customerPhone, customerId, myOrderIds } = useApp();
  const [showReceipt, setShowReceipt] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const userOrders = orders.filter(o => isUserOrder(o, customerPhone, customerId, myOrderIds));
  const order = userOrders.find(o => o.id === activeOrderId) || userOrders.find(o => o.status === 'READY') || userOrders[0];

  if (!order) return null;

  const qrPayload = JSON.stringify({
    orderId: order.id,
    orderNumber: order.orderNumber,
    customer: order.customerName,
    pickupTime: order.requestedPickupTime
  });

  const shareText = t.shareWhatsAppText
    .replace('{orderNum}', order.orderNumber)
    .replace('{time}', order.requestedPickupTime)
    .replace('{bay}', order.shelfBay || 'Сөре / Полка');
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 space-y-5 pb-24">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCustomerStep('menu')}
            className="flex items-center space-x-1 text-xs font-bold text-gray-700 hover:text-gray-900 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-2xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToMenu}</span>
          </button>
          <button
            onClick={() => setCustomerStep('tracking')}
            className="text-xs text-gray-500 hover:text-gray-800 font-medium"
          >
            {t.backToStatus}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCustomerStep('history')}
            className="flex items-center space-x-1 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200 transition-all"
          >
            <Receipt className="w-3.5 h-3.5 text-orange-600" />
            <span>{t.myOrders}</span>
          </button>
          <span className="text-xs font-mono font-bold text-gray-500">{t.passcardTitle}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-gray-900 p-6 shadow-xl text-center space-y-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-600">
            {t.readyHeader}
          </span>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mt-1">
            #{order.orderNumber}
          </h1>
          <p className="text-xs font-bold text-gray-700 mt-1">{t.customerLabel}: {order.customerName}</p>
        </div>

        <div className="bg-orange-50 border-2 border-orange-500 rounded-2xl p-3.5 text-orange-950">
          <div className="flex items-center justify-center space-x-1 text-xs font-bold uppercase tracking-wider text-orange-700">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>{t.badgeShelf}</span>
          </div>
          <div className="text-3xl font-black text-orange-900 tracking-tight mt-0.5">
            {order.shelfBay || 'Полка A1'}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border-2 border-gray-200 inline-block shadow-inner">
          <QRCodeSVG
            value={qrPayload}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="text-xs font-mono font-bold text-gray-500">
          {t.scanQrPrompt} <span className="text-gray-900 font-extrabold text-sm tracking-wider">#{order.orderNumber}</span>
        </div>

        <div className="border-t border-gray-100 pt-3 text-[11px] text-gray-500 space-y-0.5">
          {order.items.map((i, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{i.quantity}x {i.name}</span>
              <span className="font-semibold text-gray-700">{i.station.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {/* Direct WhatsApp Photo Sender Modal */}
        <button
          onClick={() => setShowWhatsAppModal(true)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black py-3.5 px-4 rounded-2xl transition-all text-xs flex items-center justify-center space-x-2 shadow-md"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span>{t.sharePhotoWhatsApp}</span>
        </button>

        {/* View Boarding Pass Modal */}
        <button
          onClick={() => setShowReceipt(true)}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center space-x-2 border border-gray-200"
        >
          <Receipt className="w-3.5 h-3.5 text-orange-600" />
          <span>{t.viewReceipt}</span>
        </button>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 text-center text-xs text-gray-500">
        {t.passcardFooter}
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
