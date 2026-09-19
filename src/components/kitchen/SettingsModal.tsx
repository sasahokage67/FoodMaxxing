import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sliders, Plus, Minus, Check } from 'lucide-react';
import { StationId } from '../../types';

interface Props { isOpen: boolean; onClose: () => void; }

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { stations, setStationCapacity, getStationName, t, lang } = useApp();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{t.settingsModalTitle}</h2>
            <p className="text-xs text-gray-500">{t.settingsModalSubtitle}</p>
          </div>
        </div>

        <div className="space-y-3">
          {stations.map(st => (
            <div key={st.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <div className="text-xs font-bold text-gray-900">{getStationName(st)}</div>
                <div className="text-[10px] text-gray-500">
                  {lang === 'kz' ? `Бос емес: ${st.currentOccupied} / ${st.capacity}` : lang === 'en' ? `Active: ${st.currentOccupied} / ${st.capacity}` : `Занято: ${st.currentOccupied} из ${st.capacity}`}
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-lg border border-gray-300">
                <button onClick={() => setStationCapacity(st.id as StationId, st.capacity - 1)} disabled={st.capacity <= 1} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs disabled:opacity-30">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-black font-mono w-4 text-center">{st.capacity}</span>
                <button onClick={() => setStationCapacity(st.id as StationId, st.capacity + 1)} className="w-6 h-6 rounded bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center justify-center text-xs">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button onClick={onClose} className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1">
            <Check className="w-4 h-4" />
            <span>{t.applySettingsBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
