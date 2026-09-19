import React, { useState, useEffect } from 'react';
import { ChefHat, X, Smartphone, ArrowRight, ShieldCheck, Check, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPhoneNumber, isPhoneValid, isAdminPhone } from '../../utils/phoneFormatter';

interface KitchenPhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KitchenPhoneAuthModal: React.FC<KitchenPhoneAuthModalProps> = ({ isOpen, onClose }) => {
  const { lang, setUserRole, setActiveTab } = useApp();

  const [kitchenPhone, setKitchenPhone] = useState<string>(() => {
    return localStorage.getItem('express_kitchen_phone') || '+7(';
  });
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('express_kitchen_phone');
      setKitchenPhone(saved ? formatPhoneNumber(saved) : '+7(');
      setStep('phone');
      setOtpCode('');
      setErrorMsg('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid(kitchenPhone)) {
      setErrorMsg(
        lang === 'kz'
          ? 'Телефон нөмірін толық енгізіңіз (10 сан)'
          : lang === 'en'
          ? 'Enter complete 10-digit phone number'
          : 'Введите полный номер телефона (10 цифр): +7(xxx)xxx xx xx'
      );
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Simulate SMS dispatch to staff member
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 450);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMsg(
        lang === 'kz'
          ? 'SMS-кодты енгізіңіз'
          : lang === 'en'
          ? 'Enter 4-digit SMS code'
          : 'Введите 4-значный SMS-код'
      );
      return;
    }

    const cleanPhone = kitchenPhone.trim();
    localStorage.setItem('express_kitchen_phone', cleanPhone);

    if (isAdminPhone(cleanPhone)) {
      localStorage.setItem('express_user_role', 'admin');
      setUserRole('admin');
      setActiveTab('admin');
    } else {
      localStorage.setItem('express_user_role', 'kitchen');
      setUserRole('kitchen');
      setActiveTab('kitchen');
    }

    setStep('success');

    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 text-white p-5 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                {lang === 'kz' ? 'Асхана экранына кіру' : lang === 'en' ? 'Kitchen KDS Login' : 'Вход в терминал кухни'}
              </h2>
              <p className="text-xs text-gray-400">
                {lang === 'kz' ? 'Қызметкерлер мен поварлар үшін' : lang === 'en' ? 'For cafeteria staff & cooks' : 'Для поваров и персонала заведения'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'phone' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  {lang === 'kz' ? 'Қызметкердің телефон нөмірі' : lang === 'en' ? 'Staff Phone Number' : 'Номер телефона сотрудника'}
                </label>
                <input
                  type="tel"
                  required
                  maxLength={16}
                  value={kitchenPhone}
                  onChange={e => {
                    setKitchenPhone(formatPhoneNumber(e.target.value));
                    if (errorMsg) setErrorMsg('');
                  }}
                  onFocus={() => { if (!kitchenPhone || kitchenPhone === '+7') setKitchenPhone('+7('); }}
                  placeholder="+7(7xx)xxx xx xx"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold font-mono focus:outline-none focus:border-orange-500"
                  autoFocus
                />
                {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-[11px] text-orange-950 space-y-1 leading-relaxed">
                <div className="flex items-center space-x-1.5 font-bold text-orange-800">
                  <ShieldCheck className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>{lang === 'kz' ? 'Қызметтік кіру' : lang === 'en' ? 'Kitchen Staff Verification' : 'Авторизация сотрудника кухни'}</span>
                </div>
                <p className="text-gray-600">
                  {lang === 'kz'
                    ? 'Асхана тапсырыстары мен мәзірді басқаруға арналған. Тестілік SMS-код: 2026'
                    : lang === 'en'
                    ? 'Access to KDS orders and cafeteria menu. Test SMS code: 2026'
                    : 'Вход для управления заказами и меню столовой. Для теста можно ввести любой номер (код: 2026).'}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>{lang === 'kz' ? 'Жіберілуде...' : lang === 'en' ? 'Sending SMS...' : 'Отправка SMS...'}</span>
                ) : (
                  <>
                    <span>{lang === 'kz' ? 'SMS-кодты алу' : lang === 'en' ? 'Send SMS Code' : 'Получить SMS-код для входа'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-gray-900">
                  {lang === 'kz' ? 'SMS-кодты енгізіңіз' : lang === 'en' ? 'Enter SMS Code' : 'Введите SMS-код'}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  {kitchenPhone}
                </p>
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="2026"
                  value={otpCode}
                  onChange={e => {
                    setOtpCode(e.target.value.replace(/\D/g, ''));
                    if (errorMsg) setErrorMsg('');
                  }}
                  autoFocus
                  className="w-full text-center tracking-widest font-mono text-2xl py-3 px-4 rounded-xl border-2 border-orange-500 focus:outline-none bg-orange-50/20 font-black text-gray-900"
                />
                {errorMsg && <p className="text-xs text-red-600 font-semibold text-center">{errorMsg}</p>}
                <p className="text-[10px] text-gray-400 text-center font-mono">
                  {lang === 'kz' ? 'Тестілік код: 2026' : lang === 'en' ? 'Test Code: 2026' : 'Тестовый SMS-код: 2026'}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'kz' ? 'Асхана экранына кіру' : lang === 'en' ? 'Enter Kitchen Terminal' : 'Войти в терминал кухни'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtpCode('');
                    setErrorMsg('');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-800 font-semibold flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === 'kz' ? 'Нөмірді өзгерту' : lang === 'en' ? 'Change Phone Number' : 'Изменить номер телефона'}</span>
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-gray-900">
                {lang === 'kz' ? 'Сәтті кірдіңіз!' : lang === 'en' ? 'Access Granted' : 'Доступ к кухне открыт!'}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === 'kz' ? 'Асхана экраны ашылуда...' : lang === 'en' ? 'Opening kitchen terminal...' : 'Переход в терминал заказов кухни...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
