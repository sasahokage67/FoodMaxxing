import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Copy, Check, Clock, MessageSquare, AlertCircle } from 'lucide-react';

interface ReceiptCardModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptCardModal: React.FC<ReceiptCardModalProps> = ({ order, isOpen, onClose }) => {
  const { t, lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const orderDate = new Date(order.createdAt).toLocaleDateString(
    lang === 'kz' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  const handleCopyText = () => {
    const lines = [
      `FOODMAXXING #${order.orderNumber}`,
      `${t.customerLabel}: ${order.customerName}`,
      `${t.targetPickupTime}: ${order.requestedPickupTime}`,
      '--- Позиции ---',
      ...order.items.map(i => `${i.quantity}x ${i.name} - ${(i.unitPrice * i.quantity).toLocaleString()} ₸`),
      '----------------',
      `${t.total}: ${order.totalAmount.toLocaleString()} ₸`
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Generates a high-res HTML5 Canvas element of the receipt ticket photo
   */
  const createReceiptCanvas = (): HTMLCanvasElement | null => {
    const canvas = document.createElement('canvas');
    const width = 640;
    const height = 820;
    canvas.width = width * 2; // 2x Retina scale
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    ctx.scale(2, 2);

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Paper Card Background
    const cardX = 30;
    const cardY = 30;
    const cardW = width - 60;
    const cardH = height - 60;
    const r = 24;

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, r);
    ctx.fill();
    ctx.restore();

    // Orange top band
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, 80, [r, r, 0, 0]);
    ctx.fill();

    // Brand Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FOODMAXXING', width / 2, cardY + 38);

    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffedd5';
    ctx.fillText(t.brandSubtitle.toUpperCase(), width / 2, cardY + 58);

    // Order Number
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.fillText(t.orderNumberLabel.toUpperCase(), width / 2, cardY + 115);

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 50px system-ui, -apple-system, sans-serif';
    ctx.fillText(`#${order.orderNumber}`, width / 2, cardY + 165);

    // Customer name & date
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${t.customerLabel}: ${order.customerName}  •  ${orderDate}`, width / 2, cardY + 195);

    // Pickup Time Badge (Prominent & Centered)
    const badgeW = 280;
    const badgeH = 54;
    const badgeX = width / 2 - badgeW / 2;
    const badgeY = cardY + 215;

    ctx.fillStyle = '#fff7ed';
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#c2410c';
    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.targetPickupTime.toUpperCase(), width / 2, badgeY + 20);

    ctx.fillStyle = '#7c2d12';
    ctx.font = '900 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(order.requestedPickupTime, width / 2, badgeY + 44);

    // Perforation line
    const perfY = cardY + 295;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(cardX + 25, perfY);
    ctx.lineTo(cardX + cardW - 25, perfY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Perforation cut-out half-circles
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cardX, perfY, 14, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cardX + cardW, perfY, 14, Math.PI / 2, -Math.PI / 2);
    ctx.fill();

    // Itemized table
    let rowY = perfY + 35;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    ctx.fillText(t.orderDetailsTitle.toUpperCase(), cardX + 25, rowY);
    rowY += 22;

    order.items.forEach(item => {
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${item.quantity}x ${item.name}`, cardX + 25, rowY);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillText(`${(item.unitPrice * item.quantity).toLocaleString()} ${t.priceKzt}`, cardX + cardW - 25, rowY);
      rowY += 24;
    });

    // Total divider
    rowY += 8;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 25, rowY);
    ctx.lineTo(cardX + cardW - 25, rowY);
    ctx.stroke();
    rowY += 26;

    // Total amount
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 18px system-ui, -apple-system, sans-serif';
    ctx.fillText(t.total.toUpperCase(), cardX + 25, rowY);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ea580c';
    ctx.font = '900 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${order.totalAmount.toLocaleString()} ${t.priceKzt}`, cardX + cardW - 25, rowY);

    // Barcode simulation
    rowY += 45;
    const barcodeX = width / 2 - 120;
    ctx.fillStyle = '#0f172a';
    for (let i = 0; i < 60; i++) {
      const barW = (i % 3 === 0 || i % 7 === 0) ? 3 : 1.5;
      ctx.fillRect(barcodeX + i * 4, rowY, barW, 35);
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`* FM - ${order.orderNumber} - VERIFIED *`, width / 2, rowY + 50);

    return canvas;
  };

  /**
   * Direct download of high-res PNG image file
   */
  const handleDownloadPhoto = () => {
    setDownloading(true);
    try {
      const canvas = createReceiptCanvas();
      if (!canvas) {
        setDownloading(false);
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `FoodMaxxing-Receipt-${order.orderNumber}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloading(false);
    } catch {
      setDownloading(false);
    }
  };

  /**
   * Sends the actual photo (PNG file) to WhatsApp:
   * 1. Via Web Share API (native share on mobile attaching the real image)
   * 2. Fallback on desktop: copies image to clipboard, downloads file, opens WhatsApp
   */
  const handleSendPhotoToWhatsApp = async () => {
    setSharing(true);
    setToastMsg(null);

    const canvas = createReceiptCanvas();
    if (!canvas) {
      setSharing(false);
      return;
    }

    canvas.toBlob(async blob => {
      if (!blob) {
        setSharing(false);
        return;
      }

      const fileName = `FoodMaxxing-Receipt-${order.orderNumber}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // 1. Check if browser supports sharing actual files (e.g. mobile Safari / Chrome)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `FoodMaxxing #${order.orderNumber}`,
            text: `Чек заказа #${order.orderNumber}`
          });
          setSharing(false);
          return;
        } catch {
          // If user cancelled, fall through to fallback
        }
      }

      // 2. Desktop Fallback: Copy Image to Clipboard + Auto-Download + Open WhatsApp Web
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        }
      } catch {
        // clipboard access denied/not supported
      }

      // Download file to device
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Open WhatsApp Web or App
      window.open('https://web.whatsapp.com/', '_blank');

      setToastMsg(t.photoCopiedToast);
      setTimeout(() => setToastMsg(null), 6000);
      setSharing(false);
    }, 'image/png');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-sm my-6 space-y-4"
      >
        {/* Toast Notification Alert */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-start space-x-2 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Digital Boarding Pass Ticket Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-900 relative">
          {/* Top Brand Header */}
          <div className="bg-orange-600 text-white p-4 text-center relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/35 hover:bg-black/50 active:scale-90 text-white flex items-center justify-center transition-all z-30 cursor-pointer shadow-md"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="font-black text-lg tracking-wider">FOODMAXXING</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-orange-200 mt-0.5">
              {t.brandSubtitle}
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-4 text-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                {t.orderNumberLabel}
              </span>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight mt-0.5">
                #{order.orderNumber}
              </h1>
              <p className="text-xs font-semibold text-gray-600 mt-1">
                {order.customerName} • {orderDate}
              </p>
            </div>

            {/* Time Slot Badge (Centered, prominent) */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-3 text-center">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700 flex items-center justify-center space-x-1">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>{t.targetPickupTime}</span>
              </div>
              <div className="text-2xl font-black text-orange-950 mt-0.5 font-mono">
                {order.requestedPickupTime}
              </div>
            </div>

            {/* Perforation Line with Side Cutouts */}
            <div className="relative py-2">
              <div className="border-t-2 border-dashed border-gray-300" />
              <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/80" />
              <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/80" />
            </div>

            {/* Order Items Table */}
            <div className="space-y-1.5 text-left text-xs">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {t.orderDetailsTitle}
              </div>
              <div className="space-y-1 divide-y divide-gray-100">
                {order.items.map((i, idx) => (
                  <div key={idx} className="pt-1 flex justify-between font-medium text-gray-800">
                    <span>{i.quantity}x {i.name}</span>
                    <span className="font-mono text-gray-500">
                      {(i.unitPrice * i.quantity).toLocaleString()} {t.priceKzt}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline font-black">
                <span className="text-sm text-gray-900">{t.total}</span>
                <span className="text-xl text-orange-600">
                  {order.totalAmount.toLocaleString()} {t.priceKzt}
                </span>
              </div>
            </div>

            {/* Scannable QR Code */}
            <div className="pt-1 flex flex-col items-center justify-center">
              <div className="p-2.5 bg-white rounded-xl border border-gray-200 inline-block shadow-xs">
                <QRCodeSVG
                  value={JSON.stringify({ orderId: order.id, num: order.orderNumber, time: order.requestedPickupTime })}
                  size={120}
                  level="M"
                />
              </div>
              <div className="text-[10px] font-mono text-gray-400 mt-1">
                * FM - {order.orderNumber} - VERIFIED *
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: 1. Send Photo to WhatsApp, 2. Download Photo PNG, 3. Copy Text */}
        <div className="space-y-2 pt-1">
          {/* Primary: Send Photo to WhatsApp */}
          <button
            onClick={handleSendPhotoToWhatsApp}
            disabled={sharing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-3 px-4 rounded-2xl shadow-lg transition-all text-xs flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{sharing ? t.downloading : t.sharePhotoWhatsApp}</span>
          </button>

          {/* Secondary: Download Photo PNG */}
          <button
            onClick={handleDownloadPhoto}
            disabled={downloading}
            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? t.downloading : t.downloadPhoto}</span>
          </button>

          {/* Tertiary: Copy Text */}
          <button
            onClick={handleCopyText}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-xl transition-all text-xs flex items-center justify-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.copied : t.copyReceipt}</span>
          </button>

          {/* Explicit Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-white/20 hover:bg-white/30 active:scale-98 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center space-x-1.5 border border-white/25 mt-1"
          >
            <X className="w-4 h-4" />
            <span>{lang === 'kz' ? 'Чекті жабу' : lang === 'en' ? 'Close Receipt' : 'Закрыть чек'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
