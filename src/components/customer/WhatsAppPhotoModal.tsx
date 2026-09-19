import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  MessageSquare,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Phone,
  ExternalLink,
  HelpCircle,
  MousePointer
} from 'lucide-react';
import {
  getReceiptDataUrl,
  copyReceiptPhotoToClipboard,
  downloadReceiptPhoto
} from '../../utils/receiptGenerator';

interface WhatsAppPhotoModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppPhotoModal: React.FC<WhatsAppPhotoModalProps> = ({ order, isOpen, onClose }) => {
  const { t, lang, customerPhone } = useApp();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [showPasteToast, setShowPasteToast] = useState(false);
  const [sending, setSending] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && order) {
      const url = getReceiptDataUrl(order, t, lang);
      setPhotoUrl(url);
      setShowPasteToast(false);
      setSending(false);
      setCopied(false);
      setDownloaded(false);
      setRecipientPhone(customerPhone || order.customerPhone || '');
    }
  }, [isOpen, order, t, lang, customerPhone]);

  if (!isOpen || !order) return null;

  // 1-Click: Copies to clipboard, downloads PNG, opens WhatsApp Web
  const handleCopyAndOpenWhatsApp = async () => {
    setSending(true);
    // 1. Copy image synchronously to clipboard
    const ok = await copyReceiptPhotoToClipboard(order, t, lang);
    if (ok) {
      setCopied(true);
    }

    // 2. Download file as backup
    downloadReceiptPhoto(order, t, lang);

    // 3. Open WhatsApp Web or chat with recipient
    const cleanPhone = recipientPhone.replace(/\D/g, '');
    const waUrl = cleanPhone
      ? `https://web.whatsapp.com/send?phone=${cleanPhone}`
      : 'https://web.whatsapp.com/';

    window.open(waUrl, '_blank');
    setShowPasteToast(true);
    setSending(false);
  };

  const handleManualCopy = async () => {
    const ok = await copyReceiptPhotoToClipboard(order, t, lang);
    if (ok) {
      setCopied(true);
      setShowPasteToast(true);
      setTimeout(() => setCopied(false), 4000);
    }
  };

  const handleManualDownload = () => {
    downloadReceiptPhoto(order, t, lang);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-sm my-6 bg-white rounded-3xl shadow-2xl border-2 border-gray-900 overflow-hidden space-y-3 animate-in zoom-in-95"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shadow-2xs">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-tight">
                {t.photoPreviewTitle}
              </h3>
              <span className="text-[10px] text-emerald-100 font-mono">
                #{order.orderNumber} • {order.requestedPickupTime}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 pt-1 space-y-3.5">
          {/* Important Paste Alert Banner */}
          {showPasteToast && (
            <div className="bg-emerald-600 text-white text-xs font-semibold p-3.5 rounded-2xl shadow-lg space-y-1 animate-in slide-in-from-top-2 border-2 border-emerald-400">
              <div className="flex items-center space-x-1.5 text-emerald-100 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>{t.photoCopiedSuccess}</span>
              </div>
              <p className="text-[11px] text-white leading-relaxed">
                {t.pasteHint}
              </p>
            </div>
          )}

          {/* Real Photo Preview */}
          <div className="relative group">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Фото-билет заказа:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                2x Retina PNG
              </span>
            </div>

            <div className="relative rounded-2xl border-2 border-gray-900 shadow-inner bg-slate-900 p-2 overflow-hidden">
              {photoUrl ? (
                <div className="relative">
                  <img
                    src={photoUrl}
                    alt={`Receipt #${order.orderNumber}`}
                    draggable={true}
                    className="w-full rounded-xl shadow-lg cursor-grab active:cursor-grabbing hover:opacity-95 transition-opacity"
                    title={t.dragPhotoHint}
                  />
                  {/* Drag hint overlay tag */}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-medium py-1 px-2 rounded-lg text-center flex items-center justify-center space-x-1 pointer-events-none">
                    <MousePointer className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{t.dragPhotoHint}</span>
                  </div>
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center text-xs text-gray-400">
                  Генерация фото...
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Recipient Phone Input */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <label className="font-bold text-gray-700 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.recipientPhoneLabel}</span>
              </label>

              {customerPhone && (
                <button
                  type="button"
                  onClick={() => setRecipientPhone(customerPhone)}
                  className="text-emerald-700 font-bold hover:underline text-[10px]"
                >
                  {t.sendToMyself}
                </button>
              )}
            </div>

            <input
              type="tel"
              value={recipientPhone}
              onChange={e => setRecipientPhone(e.target.value)}
              placeholder="+7 (7XX) XXX-XXXX (или оставьте пустым)"
              className="w-full text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Primary Action Button: 1-Click Fast Action */}
          <div className="space-y-2 pt-0.5">
            <button
              type="button"
              onClick={handleCopyAndOpenWhatsApp}
              disabled={sending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black py-3 px-4 rounded-2xl shadow-lg transition-all text-xs flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>1-Клик: Скопировать фото и открыть WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
            </button>

            {/* Secondary Actions: Copy photo & Download PNG */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleManualCopy}
                className={`py-2.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border ${
                  copied
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200'
                }`}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-600" />
                )}
                <span className="truncate">{copied ? t.copied : 'Скопировать фото'}</span>
              </button>

              <button
                type="button"
                onClick={handleManualDownload}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all border border-gray-200"
              >
                {downloaded ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-gray-600" />
                )}
                <span className="truncate">{downloaded ? 'Скачано' : 'Скачать PNG'}</span>
              </button>
            </div>

            {/* Clear Close Button at bottom */}
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 active:scale-98 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all border border-gray-300 mt-1 cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
              <span>{lang === 'kz' ? 'Жабу' : lang === 'en' ? 'Close' : 'Закрыть окно'}</span>
            </button>
          </div>

          {/* Explanatory FAQ / Hint */}
          <div className="pt-1 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full flex items-center justify-between text-[11px] text-gray-500 hover:text-gray-800 font-medium py-1 text-left"
            >
              <span className="flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                <span>{t.whyNoAutoAttach}</span>
              </span>
              <span className="text-[10px] text-gray-400 font-bold">
                {showExplanation ? '▲' : '▼'}
              </span>
            </button>

            {showExplanation && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-[10px] text-amber-900 leading-relaxed space-y-1 animate-in fade-in">
                <p>{t.whyNoAutoAttachText}</p>
                <p className="font-semibold text-amber-950">
                  Самый быстрый способ: нажмите <strong>«Скопировать фото»</strong>, перейдите в WhatsApp и нажмите <strong>Ctrl + V</strong>!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
