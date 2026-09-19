import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, QrCode, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; }

export const QRScannerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { orders, verifyPickup, t, lang } = useApp();
  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; waitSecs?: number } | null>(null);

  if (!isOpen) return null;
  const readyOrders = orders.filter(o => o.status === 'READY');

  const handleVerify = (code: string) => {
    const res = verifyPickup(code);
    if (res.success && res.order) {
      setScanResult({
        success: true,
        message: lang === 'kz' ? `№${res.order.orderNumber} тапсырысы берілді (${res.order.customerName})!` : lang === 'en' ? `Order #${res.order.orderNumber} handed over to ${res.order.customerName}!` : `Заказ #${res.order.orderNumber} выдан клиенту (${res.order.customerName})!`,
        waitSecs: res.order.actualWaitTimeSeconds || 68
      });
      setInputCode('');
    } else {
      setScanResult({ success: false, message: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{t.scannerModalTitle}</h2>
            <p className="text-xs text-gray-500">{t.scannerModalSubtitle}</p>
          </div>
        </div>

        {scanResult && (
          <div className={`p-4 rounded-2xl flex items-start space-x-3 border-2 ${scanResult.success ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-red-50 border-red-400 text-red-900'}`}>
            {scanResult.success ? <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />}
            <div>
              <div className="font-extrabold text-sm">{scanResult.message}</div>
              {scanResult.waitSecs && (
                <div className="text-xs text-emerald-700 mt-1 font-semibold">
                  {t.measuredDwell} {Math.floor(scanResult.waitSecs / 60)} {t.minAbbr} {scanResult.waitSecs % 60}s
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">{t.scanInputLabel}</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputCode}
              onChange={e => setInputCode(e.target.value)}
              placeholder="e.g. 181 / 184"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 font-mono font-bold text-base focus:outline-none focus:border-orange-500"
              onKeyDown={e => { if (e.key === 'Enter' && inputCode) handleVerify(inputCode); }}
            />
            <button onClick={() => handleVerify(inputCode)} disabled={!inputCode} className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs disabled:opacity-50">
              {t.verifyBtn}
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
            <span>{t.stagedOnShelves} ({readyOrders.length})</span>
            <span className="text-[10px] text-gray-400 font-normal">{t.clickToSimulate}</span>
          </div>
          {readyOrders.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center">{t.noReadyOrders}</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {readyOrders.map(ord => (
                <div key={ord.id} onClick={() => handleVerify(ord.orderNumber)} className="p-3 bg-gray-50 hover:bg-orange-50 hover:border-orange-300 border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer transition-all group">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-base text-gray-900 group-hover:text-orange-600">#{ord.orderNumber}</span>
                    <div>
                      <div className="text-xs font-bold text-gray-800">{ord.customerName}</div>
                      <div className="text-[10px] text-gray-500">{ord.shelfBay} · {ord.items.map(i => i.name).join(', ')}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-600 flex items-center group-hover:translate-x-1 transition-transform">
                    {t.completeHandoverBtn} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
