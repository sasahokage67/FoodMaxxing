import React, { useState } from 'react';
import { ChefHat, X, CheckCircle2, Building2, MapPin, User, Phone, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KitchenRegisterModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { lang } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [kitchenName, setKitchenName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kitchenName || !phone) return;

    // Save registration inquiry locally or to Supabase
    try {
      const currentInquiries = JSON.parse(localStorage.getItem('foodmaxxing_kitchen_inquiries') || '[]');
      currentInquiries.push({
        id: 'req_' + Date.now(),
        kitchenName,
        locationName,
        contactName,
        phone,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('foodmaxxing_kitchen_inquiries', JSON.stringify(currentInquiries));
    } catch {
      // ignore
    }

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setKitchenName('');
    setLocationName('');
    setContactName('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gray-900 text-white p-5 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                {lang === 'kz' ? 'Асхананы тіркеу' : lang === 'en' ? 'Register Cafeteria / Kitchen' : 'Зарегистрировать кухню'}
              </h2>
              <p className="text-xs text-gray-400">
                {lang === 'kz' ? 'FoodMaxxing желісіне қосылу' : lang === 'en' ? 'Partner onboarding for high-traffic food courts' : 'Подключение столовой к системе FoodMaxxing'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900">
                {lang === 'kz' ? 'Өтінім сәтті қабылданды!' : lang === 'en' ? 'Application Received Successfully!' : 'Заявка успешно принята!'}
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                {lang === 'kz'
                  ? 'Біздің инженерлік топ 15 минут ішінде хабарласып, асханаңызға арналған KDS экраны мен сөрелерді баптап береді.'
                  : lang === 'en'
                  ? 'Our engineering team will contact you within 15 minutes to provision your cook KDS terminal and shelf bays.'
                  : 'Мы свяжемся с вами в течение 15 минут для выдачи учетной записи, настройки KDS-терминала поваров и тепловых полок.'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs text-left font-mono space-y-1">
              <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Детали заявки:</div>
              <div className="font-bold text-gray-900">{kitchenName}</div>
              <div className="text-gray-600">{locationName || 'Кампус / БЦ'}</div>
              <div className="text-orange-600 font-bold">{phone}</div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold text-xs transition-all"
            >
              {lang === 'kz' ? 'Жабу' : lang === 'en' ? 'Close' : 'Отлично, закрыть'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-orange-600" />
                <span>{lang === 'kz' ? 'Асхана / нүктенің атауы' : lang === 'en' ? 'Cafeteria / Venue Name' : 'Название столовой или заведения'} *</span>
              </label>
              <input
                type="text"
                required
                value={kitchenName}
                onChange={e => setKitchenName(e.target.value)}
                placeholder="e.g. Столовая Главного корпуса, Burger Hub"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <span>{lang === 'kz' ? 'Орналасқан жері (Университет / БЦ)' : lang === 'en' ? 'Location (Campus / Building)' : 'Локация (Университет / Бизнес-центр)'}</span>
              </label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                placeholder="e.g. КазНУ им. аль-Фараби, корпус 3 / БЦ Нурлы Тау"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  <span>{lang === 'kz' ? 'Байланыс тұлғасы' : lang === 'en' ? 'Manager Name' : 'Имя управляющего'}</span>
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="e.g. Азамат С."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'kz' ? 'Телефон' : lang === 'en' ? 'Phone Number' : 'Номер телефона'} *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+7 (7XX) XXX-XX-XX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 font-medium font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-[11px] text-orange-900 leading-relaxed">
              <strong>Бесплатный пилотный запуск:</strong> подключение, предоставление планшета с экраном повара и обучение персонала занимают менее 24 часов.
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-xs"
              >
                <span>{lang === 'kz' ? 'Қосылуға өтінім жіберу' : lang === 'en' ? 'Submit Kitchen Application' : 'Отправить заявку на подключение'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
