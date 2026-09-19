import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-900 text-white p-5 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                Политика конфиденциальности
              </h2>
              <p className="text-xs text-gray-400">
                Защита персональных данных сервиса FoodMaxxing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700 leading-relaxed">
          <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-2xl text-[11px] text-orange-950 font-medium">
            Настоящая Политика составлена в строгом соответствии с Законом Республики Казахстан от 21 мая 2013 года № 94-V «О персональных данных и их защите» и регулирует порядок сбора, обработки и защиты данных пользователей FoodMaxxing.
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black text-gray-900">1. Общие положения</h3>
            <p>
              1.1. Сервис FoodMaxxing уважает право на конфиденциальность каждого пользователя и обеспечивает безопасность персональных данных при использовании веб-платформы.
            </p>
            <p>
              1.2. Регистрация на Сервисе и оформление заказов осуществляются при полном согласии пользователя с условиями настоящей Политики.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black text-gray-900">2. Состав собираемых данных</h3>
            <p>В рамках предоставления услуг экспресс-выдачи питания Сервис собирает:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Номер мобильного телефона пользователя (основной идентификатор аккаунта);</li>
              <li>Имя пользователя (для маркировки блюд на кухне и выдачи в ячейку);</li>
              <li>История оформленных заказов, состав блюд и электронные чеки;</li>
              <li>Выбранное время самовывоза (таймслоты) и факт получения заказа.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black text-gray-900">3. Цели сбора и обработки данных</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Авторизация пользователя без паролей с помощью одноразовых SMS-кодов;</li>
              <li>Формирование расписания кухни Just-In-Time к выбранной минуте выдачи;</li>
              <li>Отправка оповещений о готовности заказа и номере ячейки на подогреваемой полке;</li>
              <li>Предотвращение ложных заказов, спама и обеспечение безопасности сервиса.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black text-gray-900">4. Защита и нераспространение данных</h3>
            <p>
              4.1. Сервис использует современные методы шифрования (SSL/TLS) при передаче данных между браузером и сервером базы данных.
            </p>
            <p>
              4.2. Персональные данные никогда не продаются и не передаются рекламным сетям или третьим лицам, кроме случаев, прямо предусмотренных законами Республики Казахстан.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black text-gray-900">5. Права пользователя</h3>
            <p>
              Пользователь вправе в любой момент выйти из учетной записи и потребовать удаления своих персональных данных и истории заказов.
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500">
            Оператор сервиса: ТОО «FoodMaxxing Express», г. Астана / г. Алматы. Телефон: +7 (778) 508 86 63. Контакт: support@foodmaxxing.kz
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
