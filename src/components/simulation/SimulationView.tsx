import React, { useState } from 'react';
import { runSimulation } from '../../engine/simulator';
import { SimulationResult } from '../../types';
import { useApp } from '../../context/AppContext';
import { Play, TrendingUp, Users, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

export const SimulationView: React.FC = () => {
  const { t, lang } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(() => runSimulation(100));

  const handleRunSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setResults(runSimulation(100));
      setIsRunning(false);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>{t.simHeroBadge}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">{t.simHeroTitle}</h1>
          <p className="text-blue-200 text-xs md:text-sm leading-relaxed">{t.simHeroDesc}</p>
          <div className="pt-3">
            <button onClick={handleRunSimulation} disabled={isRunning} className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black px-6 py-3 rounded-2xl shadow-lg transition-all text-xs tracking-wide uppercase disabled:opacity-50">
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? t.runningSimBtn : t.runSimBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border-2 border-emerald-500 p-4 shadow-2xs">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.metricThroughput}</div>
              <div className="text-3xl font-black text-emerald-600 mt-1 tabular-nums">+{results.throughputIncreasePercent}%</div>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">{results.traditional.completedOrders} → <strong>{results.express.completedOrders}</strong></p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-orange-500 p-4 shadow-2xs">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.metricAvgWait}</div>
              <div className="text-3xl font-black text-orange-600 mt-1 tabular-nums">{results.express.averageWaitMinutes} {t.minAbbr}</div>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">{lang === 'kz' ? 'Орнына' : lang === 'en' ? 'Down from' : 'Вместо'} <strong>{results.traditional.averageWaitMinutes} {t.minAbbr}</strong> (-{results.waitTimeReductionPercent}%)</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.metricPeakQueue}</div>
              <div className="text-3xl font-black text-gray-900 mt-1 tabular-nums">{results.express.peakQueueLength} {lang === 'kz' ? 'адам' : lang === 'en' ? 'people' : 'чел.'}</div>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">{lang === 'kz' ? 'Орнына' : lang === 'en' ? 'Down from' : 'Вместо'} <strong>{results.traditional.peakQueueLength}</strong></p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t.metricAbandoned}</div>
              <div className="text-3xl font-black text-blue-600 mt-1 tabular-nums">{results.express.abandonedOrders} {lang === 'kz' ? 'адам' : lang === 'en' ? 'lost' : 'чел.'}</div>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">{lang === 'kz' ? 'Орнына' : lang === 'en' ? 'Down from' : 'Вместо'} <strong>{results.traditional.abandonedOrders}</strong></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-300 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">{t.scenATitle}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{t.scenASubtitle}</h3>
                </div>
                <Users className="w-6 h-6 text-red-500" />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-gray-700 font-semibold mb-1">
                    <span>{lang === 'kz' ? 'Орындалған тапсырыс (90 мин):' : lang === 'en' ? 'Orders completed (90 min):' : 'Выполнено заказов за 90 мин:'}</span>
                    <span className="font-mono font-bold text-gray-900">{results.traditional.completedOrders} / 100</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${results.traditional.completedOrders}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-red-50/60 rounded-xl space-y-1.5 text-red-950">
                  <div className="font-bold flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-600" />
                    {lang === 'kz' ? 'Кезек пен шығын себептері:' : lang === 'en' ? 'Why queue explodes:' : 'Причины очередей и потерь:'}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-red-900">
                    <li>{t.scenADesc1}</li>
                    <li>{t.scenADesc2}</li>
                    <li>{t.scenADesc3}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-emerald-500 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{t.scenBTitle}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{t.scenBSubtitle}</h3>
                </div>
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-gray-700 font-semibold mb-1">
                    <span>{lang === 'kz' ? 'Орындалған тапсырыс (90 мин):' : lang === 'en' ? 'Orders completed (90 min):' : 'Выполнено заказов за 90 мин:'}</span>
                    <span className="font-mono font-bold text-emerald-700">{results.express.completedOrders} / 100 (+{results.throughputIncreasePercent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${results.express.completedOrders}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl space-y-1.5 text-emerald-950">
                  <div className="font-bold flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {lang === 'kz' ? 'Өсім неден пайда болады:' : lang === 'en' ? 'Why throughput increases:' : 'За счет чего растет пропускная способность:'}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-900">
                    <li>{t.scenBDesc1}</li>
                    <li>{t.scenBDesc2}</li>
                    <li>{t.scenBDesc3}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">{t.qaTitle}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600 leading-relaxed">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                <strong className="text-gray-900 block mb-1">{t.qa1Title}</strong>
                {t.qa1Text}
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                <strong className="text-gray-900 block mb-1">{t.qa2Title}</strong>
                {t.qa2Text}
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                <strong className="text-gray-900 block mb-1">{t.qa3Title}</strong>
                {t.qa3Text}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
