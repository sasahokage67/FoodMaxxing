import React, { useState, useEffect } from 'react';
import { useApp, isUserOrder } from '../../context/AppContext';
import { ChefHat, Smartphone, Volume2, VolumeX, Receipt, LogOut } from 'lucide-react';
import { Language } from '../../i18n/translations';
import { PhoneAuthModal } from './PhoneAuthModal';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    resetDemoData,
    orders,
    lang,
    setLang,
    soundEnabled,
    toggleSound,
    t,
    customerStep,
    setCustomerStep,
    myOrderIds,
    customerPhone,
    customerId,
    userRole,
    isAdmin,
    inquiries,
    lockAdmin,
    unlockKitchenWithPin,
    lockKitchen
  } = useApp();

  const [showPhoneAuthModal, setShowPhoneAuthModal] = useState(false);

  // Auto-detect URL parameter ?role=kitchen or ?pin=2026
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pin = params.get('pin');
    const role = params.get('role');
    if (pin && unlockKitchenWithPin(pin)) {
      // Unlocked via URL
    } else if (role === 'kitchen') {
      unlockKitchenWithPin('2026');
    }
  }, []);

  const activeKitchenCount = orders.filter(o => o.status === 'SCHEDULED' || o.status === 'COOKING').length;
  const readyCount = orders.filter(o => o.status === 'READY').length;
  const userOrdersCount = orders.filter(o => isUserOrder(o, customerPhone, customerId, myOrderIds)).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 px-4 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-center justify-between gap-3 min-h-[44px]">
          {/* Brand & Language Switcher */}
          <div className="flex items-center justify-start space-x-2.5 w-full md:w-auto">
            <div
              className="flex items-center space-x-2.5 cursor-pointer"
              onClick={() => {
                setActiveTab('customer');
                setCustomerStep('venue');
              }}
            >
              <img
                src="/logo.png"
                alt="FoodMaxxing"
                className="w-10 h-10 rounded-xl object-cover shadow-xs"
              />
              <span className="font-extrabold text-lg tracking-tight text-gray-900 leading-none">
                FoodMaxxing
              </span>
            </div>

            {/* Tri-Lingual Switcher */}
            <div className="flex items-center">
              {/* Lang switcher */}
              <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-[11px] font-bold">
                {(['kz', 'ru', 'en'] as Language[]).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2 py-0.5 rounded-md uppercase transition-all ${
                      lang === l
                        ? 'bg-white text-gray-900 shadow-2xs font-extrabold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {l === 'kz' ? 'ҚАЗ' : l === 'ru' ? 'РУС' : 'ENG'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* View Switcher Tabs (Role Gated) - Centered */}
          <nav className="flex items-center space-x-1.5 bg-gray-100 p-1 rounded-xl w-full md:w-auto justify-center md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 shadow-xs">
            <button
              onClick={() => {
                setActiveTab('customer');
                setCustomerStep('venue');
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'customer' && customerStep !== 'history'
                  ? 'bg-white text-gray-900 shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.customerApp}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('customer');
                setCustomerStep('history');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'customer' && customerStep === 'history'
                  ? 'bg-white text-gray-900 shadow-xs font-bold text-orange-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{t.myOrders}</span>
              {userOrdersCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] bg-orange-600 text-white rounded-full font-bold">
                  {userOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowPhoneAuthModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {customerPhone
                  ? customerPhone
                  : lang === 'kz'
                  ? 'SMS кіру'
                  : lang === 'en'
                  ? 'SMS Login'
                  : 'Вход по SMS'}
              </span>
            </button>

            {/* Kitchen KDS tab only shown for kitchen role */}
            {userRole === 'kitchen' && (
              <button
                onClick={() => setActiveTab('kitchen')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  activeTab === 'kitchen'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5 text-orange-600" />
                <span>{t.kitchenKds}</span>
                {activeKitchenCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-orange-600 text-white rounded-full font-bold">
                    {activeKitchenCount}
                  </span>
                )}
                {readyCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 text-[10px] bg-emerald-600 text-white rounded-full font-bold">
                    {readyCount}
                  </span>
                )}
              </button>
            )}

            {/* Admin Dashboard tab */}
            {(isAdmin || userRole === 'admin') && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  activeTab === 'admin'
                    ? 'bg-orange-600 text-white shadow-xs font-bold'
                    : 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                }`}
              >
                <span>{lang === 'kz' ? 'Әкімші' : lang === 'en' ? 'Admin' : 'Админ-панель'}</span>
                {inquiries.filter(i => !i.status || i.status === 'pending').length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-red-600 text-white rounded-full font-bold">
                    {inquiries.filter(i => !i.status || i.status === 'pending').length}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Desktop Tools: Sound Toggle, Staff Access / Exit, Reset Demo */}
          <div className="hidden md:flex items-center space-x-2.5">

            {/* Kitchen Exit Button */}
            {userRole === 'kitchen' && (
              <button
                onClick={lockKitchen}
                className="flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition-all"
                title={t.exitKitchen}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.exitKitchen}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <PhoneAuthModal isOpen={showPhoneAuthModal} onClose={() => setShowPhoneAuthModal(false)} />
    </>
  );
};
