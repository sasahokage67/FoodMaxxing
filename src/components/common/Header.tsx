import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, ChefHat, Smartphone, RotateCcw, Volume2, VolumeX, Receipt, KeyRound, LogOut, X, Lock } from 'lucide-react';
import { Language } from '../../i18n/translations';
import { PhoneAuthModal } from './PhoneAuthModal';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentTimeFullStr,
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
    userRole,
    unlockKitchenWithPin,
    lockKitchen
  } = useApp();

  const [showPinModal, setShowPinModal] = useState(false);
  const [showPhoneAuthModal, setShowPhoneAuthModal] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState(false);

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

  const handleUnlockPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const ok = unlockKitchenWithPin(pinValue);
    if (ok) {
      setShowPinModal(false);
      setPinValue('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const activeKitchenCount = orders.filter(o => o.status === 'SCHEDULED' || o.status === 'COOKING').length;
  const readyCount = orders.filter(o => o.status === 'READY').length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 px-4 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Language Switcher */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div
              className="flex items-center space-x-2.5 cursor-pointer"
              onClick={() => {
                setActiveTab('customer');
                if (customerStep === 'history') setCustomerStep('menu');
              }}
            >
              <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white font-extrabold text-lg shadow-xs">
                FM
              </div>
              <div>
                <div className="font-extrabold text-base tracking-tight text-gray-900 leading-none">
                  {t.brandTitle}
                </div>
                <div className="text-[11px] font-semibold text-orange-600 mt-0.5">
                  {t.brandSubtitle}
                </div>
              </div>
            </div>

            {/* Tri-Lingual Switcher & Mobile Real-Time Clock */}
            <div className="flex items-center space-x-2">
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

              {/* Mobile real-time clock */}
              <div className="flex md:hidden items-center space-x-1.5 bg-gray-100 px-2 py-1 rounded-md text-xs font-mono font-semibold text-gray-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{currentTimeFullStr}</span>
              </div>
            </div>
          </div>

          {/* View Switcher Tabs (Role Gated) */}
          <nav className="flex items-center space-x-1.5 bg-gray-100 p-1 rounded-xl w-full md:w-auto justify-center">
            <button
              onClick={() => {
                setActiveTab('customer');
                if (customerStep === 'history') setCustomerStep('menu');
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
              {myOrderIds.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] bg-orange-600 text-white rounded-full font-bold">
                  {myOrderIds.length}
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
          </nav>

          {/* Desktop Tools: Real-Time Clock, Sound Toggle, Staff Access / Exit, Reset Demo */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Live Real-Time Clock */}
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title={t.liveClock} />
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span className="font-extrabold text-gray-900 tracking-wider">{currentTimeFullStr}</span>
            </div>

            {/* Staff Access / Role Switcher */}
            {userRole === 'customer' ? (
              <button
                onClick={() => setShowPinModal(true)}
                className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-orange-700 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 px-2.5 py-1.5 rounded-lg transition-all"
                title={t.staffAccess}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{t.staffAccess}</span>
              </button>
            ) : (
              <button
                onClick={lockKitchen}
                className="flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition-all"
                title={t.exitKitchen}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.exitKitchen}</span>
              </button>
            )}

            {/* Reset Demo */}
            <button
              onClick={resetDemoData}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 transition-colors"
              title={t.resetDemo}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Staff Access PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-gray-200 text-center relative space-y-4">
            <button
              onClick={() => {
                setShowPinModal(false);
                setPinError(false);
                setPinValue('');
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-base text-gray-900">{t.staffAccess}</h3>
              <p className="text-xs text-gray-500 mt-1">{t.enterPin}</p>
            </div>

            <form onSubmit={handleUnlockPin} className="space-y-3">
              <div>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder={t.pinPlaceholder}
                  value={pinValue}
                  onChange={e => {
                    setPinValue(e.target.value);
                    setPinError(false);
                  }}
                  autoFocus
                  className={`w-full text-center tracking-widest font-mono text-xl py-2.5 px-4 rounded-xl border-2 outline-none transition-all ${
                    pinError
                      ? 'border-red-500 bg-red-50 text-red-900'
                      : 'border-gray-300 focus:border-orange-600 focus:ring-2 focus:ring-orange-100'
                  }`}
                />
                {pinError && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">
                    {t.wrongPin}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  {t.unlockKitchen}
                </button>
              </div>

              <div className="text-[10px] text-gray-400 font-mono">
                Тестовый PIN: <strong>2026</strong>
              </div>
            </form>
          </div>
        </div>
      )}

      <PhoneAuthModal isOpen={showPhoneAuthModal} onClose={() => setShowPhoneAuthModal(false)} />
    </>
  );
};
