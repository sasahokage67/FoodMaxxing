import React, { useState } from 'react';
import { useApp, isUserOrder } from '../../context/AppContext';
import { Order } from '../../types';
import { ReceiptCardModal } from './ReceiptCardModal';
import { WhatsAppPhotoModal } from './WhatsAppPhotoModal';
import { ArrowLeft, Clock, MapPin, Receipt, ArrowRight, ShoppingBag, Sparkles, MessageSquare, AlertTriangle, Phone, CheckCircle2, X } from 'lucide-react';
import { formatPhoneNumber } from '../../utils/phoneFormatter';

export const MyOrdersList: React.FC = () => {
  const {
    orders,
    myOrderIds,
    activeOrderId,
    setActiveOrderId,
    setCustomerStep,
    t,
    lang,
    customerId,
    customerPhone,
    linkCustomerPhone,
    logoutCustomer
  } = useApp();

  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [whatsAppModalOrder, setWhatsAppModalOrder] = useState<Order | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Phone linking modal state
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState(customerPhone ? formatPhoneNumber(customerPhone) : '+7 (');
  const [smsInput, setSmsInput] = useState('');
  const [smsSent, setSmsSent] = useState(false);

  // Filter user orders: matching customerId, phone number, or myOrderIds
  const userOrders = orders.filter(o => isUserOrder(o, customerPhone, customerId, myOrderIds));

  const activeOrders = userOrders.filter(
    o => o.status === 'SCHEDULED' || o.status === 'COOKING' || o.status === 'READY'
  );

  const pastOrders = userOrders.filter(
    o => o.status === 'PICKED_UP' || o.status === 'CANCELLED'
  );

  const handleOpenTracking = (order: Order) => {
    setActiveOrderId(order.id);
    if (order.status === 'READY') {
      setCustomerStep('ready');
    } else {
      setCustomerStep('tracking');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-start space-x-2 animate-in slide-in-from-top-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <button
          onClick={() => setCustomerStep('menu')}
          className="flex items-center space-x-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToMenu}</span>
        </button>

        <div className="text-right">
          <div className="flex items-center justify-end space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h1 className="text-sm font-black text-gray-900">{t.myOrders}</h1>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            {t.clientProfile} #{customerId.slice(-5).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Optional Phone Account / Linking Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-2xs">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-gray-900">
              {customerPhone ? customerPhone : t.clientProfile}
            </div>
            <div className="text-[10px] text-gray-500">
              {customerPhone ? t.phoneLinkedToast : t.phoneModalDesc}
            </div>
          </div>
        </div>

        {customerPhone ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                logoutCustomer();
                setToastMsg(lang === 'kz' ? 'Аккаунттан сәтті шықтыңыз' : lang === 'en' ? 'Logged out successfully' : 'Вы успешно вышли из аккаунта');
                setTimeout(() => setToastMsg(null), 3000);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-red-200 text-red-600 font-bold text-[11px] shadow-2xs hover:bg-red-50 transition-all flex-shrink-0"
            >
              {lang === 'kz' ? 'Шығу' : lang === 'en' ? 'Log out' : 'Выйти'}
            </button>
            <button
              onClick={() => {
                setPhoneInput(customerPhone || '');
                setSmsSent(false);
                setSmsInput('');
                setIsPhoneModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-orange-300 text-orange-700 font-bold text-[11px] shadow-2xs hover:bg-orange-100 transition-all flex-shrink-0"
            >
              {lang === 'kz' ? 'Өзгерту' : lang === 'en' ? 'Change' : 'Изменить'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setPhoneInput('');
              setSmsSent(false);
              setSmsInput('');
              setIsPhoneModalOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-orange-300 text-orange-700 font-bold text-[11px] shadow-2xs hover:bg-orange-100 transition-all flex-shrink-0"
          >
            {t.phoneLoginBtn}
          </button>
        )}
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{t.noOrders}</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              {t.noOrdersDesc}
            </p>
          </div>
          <button
            onClick={() => setCustomerStep('menu')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-xs transition-all"
          >
            {t.backToMenu}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Orders Section */}
          {activeOrders.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-black uppercase tracking-wider text-orange-700 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-ping" />
                  <span>{t.activeOrders} ({activeOrders.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.map(order => {
                  const isReady = order.status === 'READY';
                  const isCooking = order.status === 'COOKING';

                  return (
                    <div
                      key={order.id}
                      className={`bg-white rounded-2xl border-2 p-4 shadow-sm space-y-3 transition-all ${
                        isReady
                          ? 'border-emerald-500 bg-emerald-50/20'
                          : isCooking
                          ? 'border-orange-400'
                          : 'border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-black font-mono text-gray-900">
                              #{order.orderNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                isReady
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isCooking
                                  ? 'bg-orange-100 text-orange-800 animate-pulse'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {isReady ? t.statusReady : isCooking ? t.statusCooking : t.statusScheduled}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 font-medium">
                            {order.customerName}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center text-xs font-black text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5 mr-1 text-orange-600" />
                            <span>{order.requestedPickupTime}</span>
                          </div>
                          {order.delayMinutes > 0 && (
                            <span className="text-[10px] text-red-600 font-bold block mt-0.5">
                              +{order.delayMinutes}m
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Shelf Bay Highlight if Ready */}
                      {isReady && (
                        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 flex items-center justify-between text-emerald-950">
                          <div className="flex items-center space-x-1.5 text-xs font-black">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span><strong>{order.shelfBay || 'Полка A1'}</strong></span>
                          </div>
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                            {lang === 'kz' ? 'Кел де, ал' : lang === 'en' ? 'Ready now' : 'Забирайте'}
                          </span>
                        </div>
                      )}

                      {/* Items Summary */}
                      <div className="border-t border-gray-100 pt-2 text-xs text-gray-600 space-y-0.5">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{i.quantity}x {i.name}</span>
                            <span className="font-mono text-gray-400">{(i.unitPrice * i.quantity).toLocaleString()} {t.priceKzt}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => setWhatsAppModalOrder(order)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-white" />
                          <span>{t.sharePhotoWhatsApp}</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleOpenTracking(order)}
                            className="bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-xs transition-all"
                          >
                            <span>{t.viewStatusPass}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setSelectedReceiptOrder(order)}
                            className="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1 transition-all border border-gray-200"
                          >
                            <Receipt className="w-3.5 h-3.5 text-orange-600" />
                            <span>{t.viewReceipt}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past / Completed Orders */}
          {pastOrders.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-black uppercase tracking-wider text-gray-500">
                  {t.completedOrders} ({pastOrders.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-2xs space-y-2 opacity-85 hover:opacity-100 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-gray-900">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                          {order.status === 'PICKED_UP' ? t.statusPickedUp : t.statusCancelled}
                        </span>
                      </div>

                      <span className="text-xs font-black text-gray-900">
                        {order.totalAmount.toLocaleString()} {t.priceKzt}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500 flex justify-between">
                      <span>{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
                    </div>

                    <div className="pt-1 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setWhatsAppModalOrder(order)}
                        className="text-emerald-700 hover:text-emerald-800 font-bold text-[11px] flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="text-orange-600 hover:text-orange-700 font-bold text-[11px] flex items-center space-x-1"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>{t.viewReceipt}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Photo Receipt Modal */}
      <ReceiptCardModal
        order={selectedReceiptOrder}
        isOpen={!!selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
      />

      {/* WhatsApp Photo Sender Modal */}
      <WhatsAppPhotoModal
        order={whatsAppModalOrder}
        isOpen={!!whatsAppModalOrder}
        onClose={() => setWhatsAppModalOrder(null)}
      />

      {/* Phone Registration / Linking Modal */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-200 space-y-4 relative animate-in zoom-in-95">
            <button
              onClick={() => setIsPhoneModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-2xs">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-base font-black text-gray-900">{t.phoneModalTitle}</h2>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                {t.phoneModalDesc}
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  {t.phoneInputLabel}
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={e => setPhoneInput(formatPhoneNumber(e.target.value))}
                  onFocus={() => { if (!phoneInput) setPhoneInput('+7 ('); }}
                  onBlur={() => { if (phoneInput === '+7 (' || phoneInput === '+7') setPhoneInput(''); }}
                  placeholder="+7 (7XX) XXX-XX-XX"
                  className="w-full text-xs font-bold font-mono px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              {!smsSent ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={!phoneInput.trim()}
                    onClick={() => {
                      if (phoneInput.trim()) {
                        setSmsSent(true);
                        setSmsInput('2026'); // auto-fill demo code for seamless pitch
                      }
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all disabled:opacity-50 shadow-xs"
                  >
                    Получить SMS-код
                  </button>
                  {customerPhone && (
                    <button
                      type="button"
                      onClick={() => {
                        logoutCustomer();
                        setIsPhoneModalOpen(false);
                        setToastMsg(lang === 'kz' ? 'Аккаунттан шықтыңыз' : lang === 'en' ? 'Logged out' : 'Вы вышли из аккаунта');
                        setTimeout(() => setToastMsg(null), 3000);
                      }}
                      className="w-full bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-2 rounded-xl text-xs transition-all"
                    >
                      {lang === 'kz' ? 'Аккаунттан шығу' : lang === 'en' ? 'Log out of account' : 'Выйти из аккаунта'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5 pt-1 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-700 block">
                      {t.smsCodeLabel}
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Демо-код: 2026
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={smsInput}
                    onChange={e => setSmsInput(e.target.value)}
                    placeholder="2026"
                    className="w-full text-center tracking-widest font-mono text-base font-extrabold px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (phoneInput.trim()) {
                        linkCustomerPhone(phoneInput.trim());
                        setIsPhoneModalOpen(false);
                        setToastMsg(t.phoneLinkedToast);
                        setTimeout(() => setToastMsg(null), 5000);
                      }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.verifyPhoneBtn}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
