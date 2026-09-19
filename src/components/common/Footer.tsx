import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FaqModal } from './FaqModal';
import { KitchenRegisterModal } from './KitchenRegisterModal';
import { PhoneAuthModal } from './PhoneAuthModal';
import { ChefHat, HelpCircle, Smartphone, ShieldCheck, ArrowUpRight, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, setActiveTab, setCustomerStep, userRole } = useApp();
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isKitchenRegisterOpen, setIsKitchenRegisterOpen] = useState(false);
  const [isPhoneAuthOpen, setIsPhoneAuthOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#090D14] text-gray-400 text-xs border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Col 1: Brand Info (Left side, matching Clipr style) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                  FM
                </div>
                <span className="text-white font-black text-lg tracking-tight">FoodMaxxing</span>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
                {lang === 'kz'
                  ? 'Maximum food. Minimum waiting. Студенттер мен қызметкерлерге арналған кезексіз экспресс-тамақтану жүйесі.'
                  : lang === 'en'
                  ? 'Maximum food. Minimum waiting. High-throughput JIT express pickup platform eliminating cafeteria rush queues.'
                  : 'Maximum food. Minimum waiting. Платформа синхронизации предзаказов и кухни для столовых университетов и бизнес-центров.'}
              </p>

              <div className="pt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-900 border border-gray-800 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Production Edition • V1.0
                </span>
              </div>
            </div>

            {/* Col 2: Product */}
            <div className="md:col-span-2 space-y-3">
              <div className="text-white font-extrabold uppercase tracking-wider text-[11px]">
                {lang === 'kz' ? 'Өнім' : lang === 'en' ? 'Product' : 'Продукт'}
              </div>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('customer');
                      setCustomerStep('menu');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {lang === 'kz' ? 'Тағамдар мәзірі' : lang === 'en' ? 'Food Menu' : 'Меню блюд'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('customer');
                      setCustomerStep('venue');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {lang === 'kz' ? 'Асхананы таңдау' : lang === 'en' ? 'Campus Venues' : 'Выбор столовой'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('customer');
                      setCustomerStep('history');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {lang === 'kz' ? 'Менің тапсырыстарым' : lang === 'en' ? 'My Orders' : 'Мои заказы'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Kitchen Partners */}
            <div className="md:col-span-3 space-y-3">
              <div className="text-white font-extrabold uppercase tracking-wider text-[11px]">
                {lang === 'kz' ? 'Асханалар үшін' : lang === 'en' ? 'Kitchen Partners' : 'Для столовых'}
              </div>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setIsKitchenRegisterOpen(true)}
                    className="text-orange-400 hover:text-orange-300 font-bold transition-colors flex items-center space-x-1.5"
                  >
                    <ChefHat className="w-4 h-4" />
                    <span>{lang === 'kz' ? 'Асхананы тіркеу' : lang === 'en' ? 'Register Cafeteria' : 'Зарегистрировать кухню'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Resources & FAQ */}
            <div className="md:col-span-2 space-y-3">
              <div className="text-white font-extrabold uppercase tracking-wider text-[11px]">
                {lang === 'kz' ? 'Анықтама' : lang === 'en' ? 'Resources' : 'Ресурсы'}
              </div>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setIsFaqOpen(true)}
                    className="text-white hover:text-orange-400 font-semibold transition-colors flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
                    <span>{lang === 'kz' ? 'Сұрақ-жауап (FAQ)' : lang === 'en' ? 'FAQ' : 'Частые вопросы (FAQ)'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsPhoneAuthOpen(true)}
                    className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{lang === 'kz' ? 'SMS кіру' : lang === 'en' ? 'SMS Login' : 'Вход по номеру SMS'}</span>
                  </button>
                </li>
                <li>
                  <span className="text-gray-500 flex items-center space-x-1 text-[11px]">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>{lang === 'kz' ? 'Жүйе штатты істеп тұр' : lang === 'en' ? 'All systems operational' : 'Система работает штатно'}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 mt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <div>
              © 2026 FoodMaxxing. {lang === 'kz' ? 'Барлық құқықтар қорғалған.' : lang === 'en' ? 'All rights reserved.' : 'Все права защищены.'}
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsFaqOpen(true)} className="hover:text-gray-300 transition-colors">
                FAQ
              </button>
              <button onClick={() => setIsKitchenRegisterOpen(true)} className="hover:text-gray-300 transition-colors">
                Партнерам
              </button>
              <span>Just-In-Time Scheduling</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
      <KitchenRegisterModal isOpen={isKitchenRegisterOpen} onClose={() => setIsKitchenRegisterOpen(false)} />
      <PhoneAuthModal isOpen={isPhoneAuthOpen} onClose={() => setIsPhoneAuthOpen(false)} />
    </>
  );
};
