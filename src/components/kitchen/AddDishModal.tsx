import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodCategory, StationId } from '../../types';
import { X, Plus, UploadCloud, Check, ImageIcon, ChefHat, ShieldCheck, Leaf, Star } from 'lucide-react';

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDishAdded?: () => void;
}

const PRESET_IMAGES = [
  {
    name: 'Бургер',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Пицца',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Плов / Мясо',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Фри / Закуски',
    url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Салат',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Кофе / Напиток',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
  }
];

export const AddDishModal: React.FC<AddDishModalProps> = ({ isOpen, onClose, onDishAdded }) => {
  const { addMenuItem, lang } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>(1800);
  const [category, setCategory] = useState<FoodCategory>('Burgers & Mains');
  const [station, setStation] = useState<StationId>('grill');
  const [prepMinutes, setPrepMinutes] = useState<number>(10);
  const [calories, setCalories] = useState<number>(450);

  // Criteria
  const [isHalal, setIsHalal] = useState<boolean>(true);
  const [isVegetarian, setIsVegetarian] = useState<boolean>(false);
  const [isHit, setIsHit] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  // Image handling
  const [imageUrl, setImageUrl] = useState<string>(PRESET_IMAGES[0].url);
  const [imageTab, setImageTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successToast, setSuccessToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(lang === 'kz' ? 'Тек сурет файлдарын жүктеуге болады' : lang === 'en' ? 'Only image files are allowed' : 'Пожалуйста, выберите файл изображения');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setImageUrl(customUrlInput.trim());
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(lang === 'kz' ? 'Тағамның атауын жазыңыз' : lang === 'en' ? 'Please enter dish name' : 'Введите название блюда');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg(lang === 'kz' ? 'Бағасын дұрыс көрсетіңіз' : lang === 'en' ? 'Please enter valid price' : 'Укажите корректную стоимость блюда');
      return;
    }

    addMenuItem({
      name: name.trim(),
      nameKz: name.trim(),
      nameRu: name.trim(),
      nameEn: name.trim(),
      description: description.trim(),
      descKz: description.trim(),
      descRu: description.trim(),
      descEn: description.trim(),
      price: Number(price),
      category,
      station,
      prepMinutes: Number(prepMinutes) || 10,
      calories: Number(calories) || 0,
      imageUrl: imageUrl || PRESET_IMAGES[0].url,
      isHalal,
      isVegetarian,
      isHit,
      isAvailable
    });

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      if (onDishAdded) onDishAdded();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                {lang === 'kz' ? 'Жаңа тағам қосу' : lang === 'en' ? 'Add New Dish' : 'Добавить новое блюдо в меню'}
              </h2>
              <p className="text-xs text-gray-400">
                {lang === 'kz' ? 'Тағам критерийлерін, цехын және суретін орнату' : lang === 'en' ? 'Set criteria, station, and photo' : 'Параметры блюда, кухонный цех и фото для клиентов'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-gray-700">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'kz' ? 'Тағам мәзірге сәтті қосылды!' : lang === 'en' ? 'Dish added to menu successfully!' : 'Блюдо успешно добавлено в меню!'}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-1.5">
              1. {lang === 'kz' ? 'Негізгі деректер' : lang === 'en' ? 'Basic Information' : 'Основная информация'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-gray-700">
                  {lang === 'kz' ? 'Тағамның атауы *' : lang === 'en' ? 'Dish Name *' : 'Название блюда *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={lang === 'kz' ? 'Мысалы: Сиыр еті қосылған лағман' : lang === 'en' ? 'e.g. Handmade Beef Lagman' : 'Например: Лагман по-домашнему с говядиной'}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-semibold text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-gray-700">
                  {lang === 'kz' ? 'Сипаттамасы мен құрамы' : lang === 'en' ? 'Description & Ingredients' : 'Описание и состав'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={lang === 'kz' ? 'Құрамы, тұздығы, ет түрлері...' : lang === 'en' ? 'Fresh beef, noodles, vegetables...' : 'Свежая говядина, домашняя лапша, сладкий перец, зелень...'}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">
                  {lang === 'kz' ? 'Бағасы (теңге) *' : lang === 'en' ? 'Price (KZT) *' : 'Цена (тенге) *'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={100}
                    step={50}
                    value={price}
                    onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-extrabold text-xs"
                  />
                  <span className="absolute right-3 top-2 text-[11px] font-bold text-gray-400">₸</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">
                  {lang === 'kz' ? 'Санат' : lang === 'en' ? 'Category' : 'Категория'}
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as FoodCategory)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-semibold text-xs"
                >
                  <option value="Burgers & Mains">{lang === 'kz' ? 'Ыстық тағамдар мен бургерлер' : 'Горячие блюда и бургеры'}</option>
                  <option value="Pizzas">{lang === 'kz' ? 'Пицца және пісірмелер' : 'Пицца и выпечка'}</option>
                  <option value="Sides & Snacks">{lang === 'kz' ? 'Жеңіл тағамдар мен гарнирлер' : 'Закуски и гарниры'}</option>
                  <option value="Drinks">{lang === 'kz' ? 'Сусындар мен кофе' : 'Напитки и кофе'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Kitchen & Preparation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-1.5">
              2. {lang === 'kz' ? 'Асхана станциясы мен уақыт' : lang === 'en' ? 'Kitchen Station & Timing' : 'Кухонный цех и время'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">
                  {lang === 'kz' ? 'Цех' : lang === 'en' ? 'Station' : 'Цех приготовления'}
                </label>
                <select
                  value={station}
                  onChange={e => setStation(e.target.value as StationId)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-semibold text-xs"
                >
                  <option value="grill">{lang === 'kz' ? 'Гриль-цех' : 'Гриль (мясо, котлеты)'}</option>
                  <option value="fryer">{lang === 'kz' ? 'Фритюрница' : 'Фритюрница (закуски)'}</option>
                  <option value="oven">{lang === 'kz' ? 'Подовая печь' : 'Печь (выпечка, пицца)'}</option>
                  <option value="prep">{lang === 'kz' ? 'Суық цех' : 'Холодный цех (салаты, раздача)'}</option>
                  <option value="coffee">{lang === 'kz' ? 'Кофе-бар' : 'Кофемашина и напитки'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">
                  {lang === 'kz' ? 'Дайындалу (мин)' : lang === 'en' ? 'Prep Time (mins)' : 'Время готовки (мин)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={prepMinutes}
                  onChange={e => setPrepMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-semibold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">
                  {lang === 'kz' ? 'Калория (ккал)' : lang === 'en' ? 'Calories' : 'Калорийность (ккал)'}
                </label>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={calories}
                  onChange={e => setCalories(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-orange-500 font-semibold text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Criteria & Badges */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-1.5">
              3. {lang === 'kz' ? 'Критерийлер' : lang === 'en' ? 'Criteria' : 'Критерии и пищевые метки'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Halal */}
              <label className={'p-3 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ' + (isHalal ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 bg-gray-50')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="checkbox"
                    checked={isHalal}
                    onChange={e => setIsHalal(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-gray-900">Халяль</div>
                  <div className="text-[10px] text-gray-500">Сертификат</div>
                </div>
              </label>

              {/* Vegetarian */}
              <label className={'p-3 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ' + (isVegetarian ? 'border-green-500 bg-green-50/50' : 'border-gray-200 bg-gray-50')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-green-100 text-green-800 flex items-center justify-center font-bold">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <input
                    type="checkbox"
                    checked={isVegetarian}
                    onChange={e => setIsVegetarian(e.target.checked)}
                    className="w-4 h-4 rounded text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-gray-900">Вегетариан</div>
                  <div className="text-[10px] text-gray-500">Без мяса</div>
                </div>
              </label>

              {/* Hit */}
              <label className={'p-3 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ' + (isHit ? 'border-amber-500 bg-amber-50/50' : 'border-gray-200 bg-gray-50')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Star className="w-4 h-4" />
                  </div>
                  <input
                    type="checkbox"
                    checked={isHit}
                    onChange={e => setIsHit(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-gray-900">Хит продаж</div>
                  <div className="text-[10px] text-gray-500">Популярное</div>
                </div>
              </label>

              {/* Available */}
              <label className={'p-3 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ' + (isAvailable ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 bg-gray-50')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Check className="w-4 h-4" />
                  </div>
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={e => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-gray-900">В наличии</div>
                  <div className="text-[10px] text-gray-500">Готово к заказу</div>
                </div>
              </label>
            </div>
          </div>

          {/* Section 4: Photo / Image */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-1.5">
              4. {lang === 'kz' ? 'Тағамның суреті' : lang === 'en' ? 'Dish Photo' : 'Фотография блюда'}
            </h3>

            {/* Image Preview & Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-gray-300 bg-white flex-shrink-0 relative shadow-xs">
                {imageUrl ? (
                  <img src={imageUrl} alt="Превью" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2.5 w-full">
                <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={'px-3 py-1 rounded-lg font-bold transition-all ' + (imageTab === 'upload' ? 'bg-orange-600 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900')}
                  >
                    Загрузить файл
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('preset')}
                    className={'px-3 py-1 rounded-lg font-bold transition-all ' + (imageTab === 'preset' ? 'bg-orange-600 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900')}
                  >
                    Готовые пресеты
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={'px-3 py-1 rounded-lg font-bold transition-all ' + (imageTab === 'url' ? 'bg-orange-600 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900')}
                  >
                    Вставить URL
                  </button>
                </div>

                {imageTab === 'upload' && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-xl p-3 text-center transition-all bg-white hover:bg-orange-50/30 flex items-center justify-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-orange-600" />
                      <span>Выбрать фото на компьютере</span>
                    </button>
                    <p className="text-[10px] text-gray-400 mt-1">Поддерживаются PNG, JPG, WEBP любого разрешения</p>
                  </div>
                )}

                {imageTab === 'preset' && (
                  <div className="grid grid-cols-3 gap-1.5">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={'px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-left truncate cursor-pointer ' + (imageUrl === preset.url ? 'bg-orange-500 text-white border-orange-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100')}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                )}

                {imageTab === 'url' && (
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={e => setCustomUrlInput(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg font-bold text-xs cursor-pointer"
                    >
                      Применить
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-black rounded-xl text-xs transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить в меню столовой</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
