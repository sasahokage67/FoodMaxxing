import React, { useState, useEffect } from 'react';
import { Smartphone, X, CheckCircle2, ShieldCheck, ArrowRight, RotateCcw, KeyRound, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPhoneNumber, isPhoneValid, isAdminPhone } from '../../utils/phoneFormatter';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';

export const PhoneAuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { lang, customerPhone, linkCustomerPhone, logoutCustomer, myOrderIds, setCustomerStep, setActiveTab } = useApp();

  const [phoneInput, setPhoneInput] = useState(customerPhone ? formatPhoneNumber(customerPhone) : '+7(');
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhoneInput(customerPhone ? formatPhoneNumber(customerPhone) : '+7(');
      setStep('phone');
      setOtpCode('');
      setErrorMsg('');
      setPrivacyAccepted(false);
    }
  }, [isOpen, customerPhone]);

  if (!isOpen) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) {
      setErrorMsg(lang === 'kz' ? 'Құпиялылық саясатымен келісу қажет' : lang === 'en' ? 'You must accept the Privacy Policy' : 'Необходимо подтвердить согласие с Политикой конфиденциальности');
      return;
    }
    if (!isPhoneValid(phoneInput)) {
      setErrorMsg(lang === 'kz' ? 'Телефон нөмірін толық енгізіңіз (10 сан)' : lang === 'en' ? 'Enter a complete phone number (10 digits)' : 'Введите полный номер телефона: 10 цифр');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Simulate Supabase Phone OTP dispatch
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMsg(lang === 'kz' ? 'SMS-кодты енгізіңіз' : lang === 'en' ? 'Enter SMS code' : 'Введите 4-значный код из SMS');
      return;
    }

    // Accept test code 2026 or any 4+ digit code
    linkCustomerPhone(phoneInput);
    setStep('success');
  };

  const handleLogout = () => {
    logoutCustomer();
    setPhoneInput('');
    setOtpCode('');
    setStep('phone');
    onClose();
  };

  const handleGoToOrders = () => {
    setCustomerStep('history');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 text-white p-5 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                {lang === 'kz' ? 'Телефонмен кіру' : lang === 'en' ? 'Phone SMS Login' : 'Вход по номеру SMS'}
              </h2>
              <p className="text-xs text-gray-400">
                {lang === 'kz' ? 'Барлық тапсырыстар тарихы бір жерде' : lang === 'en' ? 'Permanent order history across all devices' : 'История всех заказов со всех ваших устройств'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'phone' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              {customerPhone ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-800 font-bold">Вы авторизованы:</span>
                    <span className="font-mono font-black text-emerald-950">{customerPhone}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Все ваши заказы автоматически привязаны к этому номеру и доступны на всех устройствах.
                  </p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-xs transition-colors"
                  >
                    Выйти из этого аккаунта
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">
                      {lang === 'kz' ? 'Телефон нөмірі' : lang === 'en' ? 'Phone Number' : 'Номер телефона'}
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={16}
                      value={phoneInput}
                      onChange={e => {
                        setPhoneInput(formatPhoneNumber(e.target.value));
                        if (errorMsg) setErrorMsg('');
                      }}
                      onFocus={() => { if (!phoneInput) setPhoneInput('+7('); }}
                      onBlur={() => { if (phoneInput === '+7(' || phoneInput === '+7') setPhoneInput(''); }}
                      placeholder="+7(7xx)xxx xx xx"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold font-mono focus:outline-none focus:border-orange-500"
                    />
                    {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}
                  </div>

                  {/* Mandatory Privacy Policy Checkbox */}
                  <label className="flex items-start space-x-2.5 text-xs text-gray-700 cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={e => {
                        setPrivacyAccepted(e.target.checked);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className="mt-0.5 w-4 h-4 rounded text-orange-600 border-gray-300 focus:ring-orange-500 cursor-pointer flex-shrink-0"
                      required
                    />
                    <span className="leading-snug text-[11px] text-gray-600">
                      Я ознакомлен и принимаю{' '}
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-orange-600 hover:text-orange-700 underline font-bold cursor-pointer inline"
                      >
                        Политику конфиденциальности
                      </button>{' '}
                      и даю согласие на обработку персональных данных.
                    </span>
                  </label>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 space-y-1 leading-relaxed">
                    <div className="flex items-center space-x-1 font-bold text-gray-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Легкая авторизация без паролей</span>
                    </div>
                    <p>Мы отправим короткий SMS-код для подтверждения. Для теста можно ввести любой номер (код: <strong>2026</strong>).</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !privacyAccepted || !isPhoneValid(phoneInput)}
                    className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>{loading ? 'Отправка SMS...' : 'Получить код по SMS'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="text-xs text-gray-500">Код отправлен на номер:</div>
                <div className="text-sm font-mono font-black text-gray-900">{phoneInput}</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block text-center">
                  Введите 4-значный код из SMS:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="2026"
                  className="w-full text-center tracking-widest text-2xl font-mono font-black px-4 py-2.5 rounded-xl border-2 border-orange-500 focus:outline-none bg-orange-50/30"
                />
                <p className="text-[11px] text-gray-500 text-center">Тестовый SMS-код для проверки: <strong>2026</strong></p>
                {errorMsg && <p className="text-xs text-red-600 font-semibold text-center">{errorMsg}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all shadow-md text-xs"
              >
                Подтвердить вход
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-800 font-semibold"
              >
                Изменить номер телефона
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
                <Check className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-gray-900">Успешный вход!</h3>
                <p className="text-xs text-gray-600">
                  Номер <strong>{phoneInput}</strong> успешно привязан. История ваших заказов обновлена.
                </p>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs flex justify-between items-center">
                <span className="text-gray-600 font-medium">Активных заказов в профиле:</span>
                <span className="font-black text-orange-600 font-mono text-sm">{myOrderIds.length}</span>
              </div>

              <div className="space-y-2 pt-1">
                {isAdminPhone(phoneInput) && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('admin');
                      onClose();
                    }}
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-orange-400" />
                    <span>Открыть панель администратора</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleGoToOrders}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                >
                  Перейти в Мои заказы
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Закрыть окно
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </div>
  );
};
