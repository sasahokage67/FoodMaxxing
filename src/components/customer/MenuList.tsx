import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodCategory } from '../../types';
import { ArrowLeft, Plus, Minus, ShoppingBag, Receipt, ChevronRight } from 'lucide-react';

export const MenuList: React.FC = () => {
  const { menuItems, cart, addToCart, updateCartQuantity, setCustomerStep, getItemName, getItemDesc, t, lang, myOrderIds } = useApp();
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>('all');
  const [activeDietFilter, setActiveDietFilter] = useState<'all' | 'halal' | 'hit' | 'veg'>('all');

  const categories = [
    { key: 'all', label: t.categories.all },
    { key: 'burgers', label: t.categories.burgers, match: 'Burgers & Mains' },
    { key: 'snacks', label: t.categories.snacks, match: 'Sides & Snacks' },
    { key: 'pizza', label: t.categories.pizza, match: 'Pizzas' },
    { key: 'drinks', label: t.categories.drinks, match: 'Drinks' },
  ];

  const activeCategoryObj = categories.find(c => c.key === activeCategoryKey);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategoryKey === 'all' || item.category === activeCategoryObj?.match;
    if (!matchesCategory) return false;

    if (activeDietFilter === 'halal') return !!item.isHalal;
    if (activeDietFilter === 'hit') return !!item.isHit;
    if (activeDietFilter === 'veg') return !!item.isVegetarian;
    return true;
  });

  const cartTotalAmount = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const cartTotalCalories = cart.reduce((sum, item) => sum + (item.menuItem.calories || 0) * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getItemQuantity = (id: string) => {
    return cart.find(ci => ci.menuItem.id === id)?.quantity || 0;
  };

  return (
    <div className="max-w-7xl mx-auto pb-28 px-4 sm:px-6 lg:px-8 pt-6">
      {/* Venue Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-200 gap-4">
        <div
          onClick={() => setCustomerStep('venue')}
          className="flex items-center space-x-3 cursor-pointer group p-2 -m-2 rounded-2xl hover:bg-gray-100 transition-all"
          title={lang === 'kz' ? 'Асхананы таңдау үшін басыңыз' : lang === 'en' ? 'Click to select venue' : 'Нажмите для выбора общепита'}
        >
          <img
            src="/logo.png"
            alt="FoodMaxxing"
            className="w-11 h-11 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                {t.cafeteriaName}
              </h1>
              <span className="text-[11px] font-bold text-gray-500 bg-gray-100 group-hover:bg-orange-100 group-hover:text-orange-700 border border-gray-200 group-hover:border-orange-300 px-2 py-0.5 rounded-lg transition-colors flex items-center space-x-1">
                <span>{lang === 'kz' ? 'Ауыстыру' : lang === 'en' ? 'Change' : 'Сменить'}</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{t.cafeteriaLoc} • {t.prepTimeAvg}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCustomerStep('venue')}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.backToVenues}</span>
          </button>

          {myOrderIds.length > 0 && (
            <button
              onClick={() => setCustomerStep('history')}
              className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl hover:bg-orange-100 transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 text-orange-600" />
              <span>{t.myOrders} ({myOrderIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout: Left Menu Grid + Right Desktop Sticky Cart */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Category Filters & Broad Food Grid */}
        <div className="flex-1 w-full min-w-0 space-y-4">
          {/* Category Pills */}
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategoryKey(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategoryKey === cat.key
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Dietary Quick Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setActiveDietFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeDietFilter === 'all'
                  ? 'bg-gray-900 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setActiveDietFilter('hit')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeDietFilter === 'hit'
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              {t.filterHit}
            </button>
            <button
              onClick={() => setActiveDietFilter('halal')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeDietFilter === 'halal'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {t.filterHalal}
            </button>
            <button
              onClick={() => setActiveDietFilter('veg')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeDietFilter === 'veg'
                  ? 'bg-green-600 text-white shadow-2xs'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {t.filterVeg}
            </button>
          </div>

          {/* Broad Grid of Dishes (1 col mobile, 2 cols tablet, 3 cols desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pt-2">
            {filteredItems.map(item => {
              const qty = getItemQuantity(item.id);
              const name = getItemName(item);
              const desc = getItemDesc(item);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Food Photo with Overlay Badges */}
                    <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 flex-wrap gap-y-1">
                        <span className="bg-black/75 backdrop-blur-xs text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                          {item.calories} {t.kcal}
                        </span>
                        {item.isHit && (
                          <span className="bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wide">
                            {t.tagHit}
                          </span>
                        )}
                      </div>

                      {/* Bottom Badges */}
                      <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1.5">
                        <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {item.prepMinutes} {t.minAbbr}
                        </span>
                        {item.isHalal && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {t.tagHalal}
                          </span>
                        )}
                        {item.isVegetarian && (
                          <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {t.tagVeg}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-1.5">
                      <h3 className="font-extrabold text-base text-gray-900 group-hover:text-orange-600 transition-colors leading-snug">
                        {name}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>

                  {/* Footer: Price & Add / Quantity Stepper */}
                  <div className="p-4 pt-1 flex items-center justify-between border-t border-gray-100">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Цена</div>
                      <div className="text-base font-black text-gray-900 tabular-nums">
                        {item.price.toLocaleString()} {t.priceKzt}
                      </div>
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center space-x-1.5 bg-orange-50 hover:bg-orange-600 hover:text-white active:scale-95 text-orange-700 border border-orange-200 px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t.addToCart}</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white text-gray-700 flex items-center justify-center font-bold hover:bg-gray-200 text-xs shadow-2xs transition-all cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-gray-900 tabular-nums w-5 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold hover:bg-orange-700 text-xs shadow-2xs transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Desktop Sticky Order Panel */}
        <div className="hidden lg:block w-88 xl:w-96 sticky top-20 flex-shrink-0">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h2 className="font-black text-base text-gray-900">{t.orderSummary}</h2>
              </div>
              {cartItemCount > 0 && (
                <span className="bg-orange-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </div>

            {cartItemCount === 0 ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="font-bold text-sm text-gray-800">
                  {lang === 'kz' ? 'Себет бос' : lang === 'en' ? 'Cart is empty' : 'Корзина пуста'}
                </div>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                  {lang === 'kz'
                    ? 'Сол жақтағы мәзірден тағамдарды таңдаңыз.'
                    : lang === 'en'
                    ? 'Add delicious items from the menu on the left.'
                    : 'Выберите блюда из меню слева, чтобы забронировать время получения без очереди.'}
                </p>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 divide-y divide-gray-100">
                  {cart.map(ci => (
                    <div key={ci.menuItem.id} className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex-1 pr-2">
                        <div className="font-bold text-gray-900 leading-tight">
                          {getItemName(ci.menuItem)}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {ci.menuItem.calories ? `${ci.menuItem.calories} ${t.kcal} · ` : ''}
                          {ci.menuItem.price.toLocaleString()} {t.priceKzt}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 bg-gray-100 px-1.5 py-0.5 rounded-lg border border-gray-200">
                        <button
                          onClick={() => updateCartQuantity(ci.menuItem.id, -1)}
                          className="w-5 h-5 rounded bg-white text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center text-[10px] cursor-pointer"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-bold text-xs tabular-nums w-4 text-center">
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(ci.menuItem.id, 1)}
                          className="w-5 h-5 rounded bg-orange-600 text-white font-bold hover:bg-orange-700 flex items-center justify-center text-[10px] cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <span className="font-black text-gray-900 tabular-nums w-16 text-right ml-2">
                        {(ci.menuItem.price * ci.quantity).toLocaleString()} {t.priceKzt}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total & Calories Summary */}
                <div className="pt-3 border-t border-gray-200 space-y-2.5">
                  {cartTotalCalories > 0 && (
                    <div className="flex items-center justify-between text-xs text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                      <span className="font-semibold">{t.totalCalories}:</span>
                      <span className="font-extrabold font-mono">{cartTotalCalories} {t.kcal}</span>
                    </div>
                  )}

                  <div className="flex items-baseline justify-between text-gray-900">
                    <span className="font-extrabold text-sm">{t.total}:</span>
                    <span className="font-black text-2xl text-orange-600 tabular-nums">
                      {cartTotalAmount.toLocaleString()} {t.priceKzt}
                    </span>
                  </div>

                  <button
                    onClick={() => setCustomerStep('slot')}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>{t.step2ChooseTime}</span>
                    <ShoppingBag className="w-4 h-4" />
                  </button>

                  <div className="text-[10px] text-center text-gray-400 font-medium">
                    Выдача за 1.5 минуты • Без очередей
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      {cartItemCount > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-gray-200 z-30 shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                {t.step1Selected} ({cartItemCount})
              </div>
              <div className="text-base font-extrabold text-gray-900 tabular-nums flex items-center space-x-2">
                <span>{cartTotalAmount.toLocaleString()} {t.priceKzt}</span>
                {cartTotalCalories > 0 && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {cartTotalCalories} {t.kcal}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setCustomerStep('slot')}
              className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all text-xs cursor-pointer"
            >
              <span>{t.step2ChooseTime}</span>
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
