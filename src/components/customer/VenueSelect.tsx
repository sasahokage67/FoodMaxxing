import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Clock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export const VenueSelect: React.FC = () => {
  const { setCustomerStep, t } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>{t.heroBadge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t.heroTitle}</h1>
        <p className="text-orange-100 text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl">
          {t.heroDesc}
        </p>

        <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-3 gap-4 text-center text-xs sm:text-sm">
          <div>
            <div className="font-extrabold text-base sm:text-lg">{t.badge3steps}</div>
            <div className="text-orange-100 text-[11px] sm:text-xs">{t.badge3stepsDesc}</div>
          </div>
          <div>
            <div className="font-extrabold text-base sm:text-lg">{t.badgeWait}</div>
            <div className="text-orange-100 text-[11px] sm:text-xs">{t.badgeWaitDesc}</div>
          </div>
          <div>
            <div className="font-extrabold text-base sm:text-lg">{t.badgeShelf}</div>
            <div className="text-orange-100 text-[11px] sm:text-xs">{t.badgeShelfDesc}</div>
          </div>
        </div>
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

      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs text-gray-500 space-y-1">
        <div className="flex items-center font-semibold text-gray-700 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-600 mr-1.5" />
          {t.noSmsTitle}
        </div>
        <p className="text-[11px] leading-relaxed">
          {t.noSmsDesc}
        </p>
      </div>
    </div>
  );
};
