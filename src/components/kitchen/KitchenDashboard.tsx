import React from 'react';
import { useApp } from '../../context/AppContext';
import { timeStringToMinutes } from '../../engine/scheduler';
import { Clock, CheckCircle2, ArrowRight, BellRing, Layers } from 'lucide-react';

export const KitchenDashboard: React.FC = () => {
  const { orders, advanceOrderStatus, delayOrder, currentTimeStr, currentTimeFullStr, t, lang } = useApp();

  const scheduledOrders = orders.filter(o => o.status === 'SCHEDULED');
  const cookingOrders = orders.filter(o => o.status === 'COOKING');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const pickedUpOrders = orders.filter(o => o.status === 'PICKED_UP');

  const currentMins = timeStringToMinutes(currentTimeStr);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      {/* KDS Header & Quick Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">{t.kdsTitle}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.liveBadge}</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'kz' ? 'Тапсырыстарды уақытында басқару терминалы' : lang === 'en' ? 'Real-Time Kitchen Orders & Expediting Terminal' : 'Терминал управления очередью и выдачей заказов'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Real-time Clock on KDS */}
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-xl text-xs font-mono font-bold text-gray-800 border border-gray-200">
            <Clock className="w-4 h-4 text-orange-600" />
            <span>{currentTimeFullStr}</span>
          </div>
        </div>
      </div>

      {/* Clean Quick Metric Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-gray-900">{scheduledOrders.length}</div>
            <div className="text-[11px] font-semibold text-gray-500">{t.colScheduled}</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-black">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-gray-900">{cookingOrders.length}</div>
            <div className="text-[11px] font-semibold text-gray-500">{t.colCooking}</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-gray-900">{readyOrders.length}</div>
            <div className="text-[11px] font-semibold text-gray-500">{t.colReady}</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-black">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-gray-900">{pickedUpOrders.length}</div>
            <div className="text-[11px] font-semibold text-gray-500">{lang === 'kz' ? 'Берілген' : lang === 'en' ? 'Completed' : 'Выдано'}</div>
          </div>
        </div>
      </div>

      {/* 3-Column Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* COL 1: SCHEDULED */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
              {t.colScheduled} ({scheduledOrders.length})
            </h2>
            <span className="text-[10px] text-gray-400 font-mono">{t.autoFires}</span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {scheduledOrders.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-400">{t.emptyScheduled}</div>
            ) : (
              scheduledOrders.map(order => {
                const fireMins = timeStringToMinutes(order.scheduledFireTime);
                const isTimeToFire = currentMins >= fireMins;

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl p-4 shadow-2xs space-y-3 transition-all ${
                      isTimeToFire
                        ? 'bg-amber-50/70 border-2 border-amber-500 shadow-sm'
                        : 'bg-white border border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-black font-mono text-gray-900">#{order.orderNumber}</span>
                          {isTimeToFire && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-orange-600 text-white animate-pulse">
                              {lang === 'kz' ? 'Бастау уақыты' : lang === 'en' ? 'Fire Now' : 'Пора начинать'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-gray-700">{order.customerName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {t.targetPickupTime} {order.requestedPickupTime}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5 font-mono">
                          {t.fireJitTime}: <strong className={isTimeToFire ? 'text-orange-700 font-extrabold' : ''}>{order.scheduledFireTime}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-2 space-y-1">
                      {order.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-700">
                          <span>{i.quantity}x {i.name}</span>
                          <span className="text-[10px] font-bold uppercase text-gray-400">{i.station} ({i.prepMinutes}m)</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => advanceOrderStatus(order.id)}
                      className={`w-full font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center space-x-1 active:scale-98 ${
                        isTimeToFire
                          ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <span>{t.startCookingBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COL 2: COOKING */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-orange-700 flex items-center">
              <span className="w-2 h-2 rounded-full bg-orange-600 mr-2 animate-pulse" />
              {t.colCooking} ({cookingOrders.length})
            </h2>
            <span className="text-[10px] text-orange-600 font-bold">{t.activeSlots}</span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {cookingOrders.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-400">{t.emptyCooking}</div>
            ) : (
              cookingOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border-2 border-orange-400 p-4 shadow-sm space-y-3 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xl font-black font-mono text-gray-900">#{order.orderNumber}</span>
                      <div className="text-xs font-bold text-gray-800">{order.customerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">{order.requestedPickupTime}</div>
                      {order.delayMinutes > 0 && <div className="text-[10px] text-red-600 font-bold mt-0.5">{t.delayedBy} +{order.delayMinutes}m</div>}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-2 space-y-1">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-900 font-medium">
                        <span>{i.quantity}x {i.name}</span>
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">{i.station.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1 flex flex-col space-y-2">
                    <button onClick={() => advanceOrderStatus(order.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center space-x-1 shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.markReadyBtn}</span>
                    </button>
                    <button onClick={() => delayOrder(order.id, 5, 'Kitchen load surge')} className="w-full bg-amber-50 hover:bg-amber-100 active:scale-98 text-amber-800 border border-amber-300 font-bold py-1.5 rounded-xl text-[11px] transition-all flex items-center justify-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.delay5mBtn}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COL 3: READY */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2" />
              {t.colReady} ({readyOrders.length})
            </h2>
            <span className="text-[10px] text-emerald-600 font-bold">{t.awaitingScan}</span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {readyOrders.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-400">{t.emptyReady}</div>
            ) : (
              readyOrders.map(order => (
                <div key={order.id} className="bg-emerald-50/50 rounded-2xl border-2 border-emerald-500 p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xl font-black font-mono text-emerald-950">#{order.orderNumber}</span>
                      <div className="text-xs font-bold text-gray-800">{order.customerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-white bg-emerald-700 px-2.5 py-1 rounded-lg shadow-2xs">{order.shelfBay}</div>
                      <div className="text-[10px] text-emerald-800 font-medium mt-1">{order.requestedPickupTime}</div>
                    </div>
                  </div>

                  <div className="border-t border-emerald-100 pt-2 text-xs text-gray-700 space-y-0.5">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{i.quantity}x {i.name}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => advanceOrderStatus(order.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
                    <span>{t.completeHandoverBtn}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {pickedUpOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.telemetryTitle}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {pickedUpOrders.slice(0, 4).map(ord => (
              <div key={ord.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                <div className="flex justify-between font-mono font-bold text-gray-900">
                  <span>#{ord.orderNumber}</span>
                  <span className="text-emerald-700">{ord.customerName}</span>
                </div>
                <div className="text-[11px] text-gray-600 mt-1">
                  {t.measuredDwell} <strong>{ord.actualWaitTimeSeconds || 74}s</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
