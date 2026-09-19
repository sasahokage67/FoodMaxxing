import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

export const VenueSelect: React.FC = () => {
  const { setCustomerStep, t } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">FoodMaxxing</h1>
        <p className="text-orange-100 text-sm sm:text-base mt-2 font-medium leading-relaxed">
          Maximum food. Minimum waiting
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 px-1">
          {t.selectLocation}
        </h2>

        {/* Responsive Grid for Venues */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Primary Venue */}
          <div
            onClick={() => setCustomerStep('menu')}
            className="bg-white rounded-2xl border-2 border-orange-500 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl">
              {t.activeNow}
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                {t.cafeteriaName}
              </h3>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                {t.cafeteriaLoc}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
              <div className="flex items-center space-x-3 text-gray-600">
                <span className="inline-flex items-center text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  {t.kitchenNormal}
                </span>
                <span className="text-gray-400">·</span>
                <span className="flex items-center text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {t.prepTimeAvg}
                </span>
              </div>

              <span className="inline-flex items-center font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                {t.orderBtn} <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>

          {/* Secondary Venue */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 opacity-60 cursor-not-allowed flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-700">{t.secondaryCafe}</h3>
                <p className="text-xs text-gray-400 flex items-center mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {t.secondaryLoc}
                </p>
              </div>
              <span className="text-[10px] font-semibold bg-gray-200 text-gray-600 px-2.5 py-1 rounded-lg">
                {t.opensAt13}
              </span>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-200 text-xs text-gray-400">
              Скоро откроется
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
