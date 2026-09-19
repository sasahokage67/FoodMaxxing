import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, X, Clock, ShieldCheck, Smartphone, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FaqItem {
  id: string;
  qKz: string;
  qRu: string;
  qEn: string;
  aKz: string;
  aRu: string;
  aEn: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: '1',
    qRu: 'Как работает экспресс-выдача за 5 минут?',
    qKz: '5 минуттық экспресс беру қалай жұмыс істейді?',
    qEn: 'How does the 5-minute express pickup work?',
    aRu: 'Вы выбираете удобный 5-минутный интервал получения (например, 12:45). Система Just-In-Time автоматически передает заказ повару ровно за нужное время до вашего прихода. К моменту вашего появления еда уже упакована и ждет на подогреваемой полке.',
    aKz: 'Сіз өзіңізге ыңғайлы 5 минуттық уақытты таңдайсыз (мысалы, 12:45). Just-In-Time жүйесі тапсырысты аспазға дәл уақытында жібереді. Сіз келгенде тағам сөреде дайын тұрады.',
    aEn: 'You select a precise 5-minute pickup window (e.g. 12:45). The Just-In-Time engine fires preparation so your meal finishes right before you arrive, waiting on a heated shelf.'
  },
  {
    id: '2',
    qRu: 'Где именно забирать готовый заказ?',
    qKz: 'Дайын тапсырысты нақты қайдан алуға болады?',
    qEn: 'Where exactly do I pick up my ready order?',
    aRu: 'В столовой установлена стеллажная стойка FoodMaxxing с пронумерованными подогреваемыми ячейками. Номер вашей полки (например, Полка A-2) отображается прямо в посадочном талоне на экране. Вы просто подходите и забираете пакет без очереди.',
    aKz: 'Асханада нөмірленген FoodMaxxing сөрелері орнатылған. Сіздің сөре нөміріңіз (мысалы, Полка A-2) билетте көрсетіледі. Сіз кезексіз келіп пакетіңізді аласыз.',
    aEn: 'Orders are staged on the FoodMaxxing heated shelf rack. Your assigned bay number (e.g. Shelf A-2) appears right on your boarding pass.'
  },
  {
    id: '3',
    qRu: 'Что произойдет, если я задержусь или опоздаю?',
    qKz: 'Егер мен кешігіп қалсам не болады?',
    qEn: 'What happens if I run late to my pickup slot?',
    aRu: 'Ваш заказ останется в тепловой ячейке и сохранит нужную температуру. Таймер переключится в режим ожидания (например: Ждет вас 5 мин), и вы сможете забрать заказ в любое время без потери качества.',
    aKz: 'Тапсырысыңыз жылытылатын сөреде сақталады. Сіз оны келген кезде еш қиындықсыз алып кете аласыз.',
    aEn: 'Your order stays in the heated bay at optimal serving temperature. The timer counts dwell time and you can pick it up whenever you arrive.'
  },
  {
    id: '4',
    qRu: 'Как работает вход по номеру телефона через SMS?',
    qKz: 'Телефон нөмірі арқылы SMS кіру қалай жұмыс істейді?',
    qEn: 'How does phone SMS registration work?',
    aRu: 'Для заказа регистрация не обязательна — заказ оформляется за 20 секунд. Но если вы введете свой телефон во вкладке Вход по SMS, система пришлет код и автоматически свяжет все ваши прошлые и будущие чеки в единый личный кабинет со всех устройств.',
    aKz: 'Тапсырыс беру үшін тіркелу міндетті емес. Бірақ телефон нөміріңізді енгізсеңіз, барлық тапсырыстар тарихы барлық құрылғылардан қолжетімді болады.',
    aEn: 'Ordering is instant without mandatory login. Entering your phone via SMS authentication seamlessly links all your past and future receipts across all devices.'
  },
  {
    id: '5',
    qRu: 'Можно ли отменить заказ и вернуть деньги?',
    qKz: 'Тапсырыстан бас тартып, ақшаны қайтаруға бола ма?',
    qEn: 'Can I cancel an order and get refunded?',
    aRu: 'Отмена доступна бесплатно в один клик, пока заказ находится в статусе Принят. Как только повара приступают к жарке на кухне (статус Готовится), отмена блокируется во избежание списания продуктов.',
    aKz: 'Тапсырыс Қабылданды күйінде тұрғанда бас тарту тегін. Аспаз дайындауды бастаған соң (Дайындалуда), тағам ысырап болмас үшін бас тарту жабылады.',
    aEn: 'Cancellation is free while order is Scheduled. Once kitchen line begins cooking, cancellation locks permanently to prevent food waste.'
  },
  {
    id: '6',
    qRu: 'Как подключить свою столовую к FoodMaxxing?',
    qKz: 'Өз асханамды FoodMaxxing жүйесіне қалай қосуға болады?',
    qEn: 'How can a cafeteria join the FoodMaxxing network?',
    aRu: 'Нажмите Зарегистрировать кухню в нижней панели, укажите название заведения и контактный телефон. Наша команда развернет терминал заказов для поваров и настроит оборудование за 1 рабочий день.',
    aKz: 'Төменгі панельдегі Асхананы тіркеу түймесін басып, мәліметтерді қалдырыңыз. Біздің топ 1 күнде тапсырыстар терминалын орнатып береді.',
    aEn: 'Click Register Kitchen in the bottom panel. Our engineering team provisions the kitchen order terminal and capacity slots within one business day.'
  }
];

export const FaqModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { lang } = useApp();
  const [openId, setOpenId] = useState<string | null>('1');

  if (!isOpen) return null;

  const getQ = (item: FaqItem) => (lang === 'kz' ? item.qKz : lang === 'en' ? item.qEn : item.qRu);
  const getA = (item: FaqItem) => (lang === 'kz' ? item.aKz : lang === 'en' ? item.aEn : item.aRu);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gray-900 text-white p-5 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                {lang === 'kz' ? 'Жиі қойылатын сұрақтар (FAQ)' : lang === 'en' ? 'Frequently Asked Questions (FAQ)' : 'Частые вопросы (FAQ)'}
              </h2>
              <p className="text-xs text-gray-400">
                {lang === 'kz' ? 'FoodMaxxing жүйесі қалай жұмыс істейді' : lang === 'en' ? 'Everything you need to know about FoodMaxxing' : 'Всё об экспресс-выдаче, времени и заказах'}
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {FAQ_ITEMS.map(item => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`border rounded-2xl transition-all overflow-hidden ${
                  isOpen ? 'border-orange-500/40 bg-orange-50/20' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full p-4 text-left flex items-center justify-between space-x-3"
                >
                  <span className="font-bold text-sm text-gray-900">{getQ(item)}</span>
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-orange-600" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                    {getA(item)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all"
          >
            {lang === 'kz' ? 'Түсінікті, жабу' : lang === 'en' ? 'Got it, close' : 'Понятно, закрыть'}
          </button>
        </div>
      </div>
    </div>
  );
};
