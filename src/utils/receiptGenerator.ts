import { Order } from '../types';
import { Language, Translations } from '../i18n/translations';

/**
 * Renders high-res 2x Retina canvas of the digital boarding-pass photo receipt
 */
export const createReceiptCanvas = (
  order: Order,
  t: Translations,
  lang: Language
): HTMLCanvasElement | null => {
  const canvas = document.createElement('canvas');
  const width = 640;
  const height = 820;
  canvas.width = width * 2; // 2x Retina scale
  canvas.height = height * 2;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  ctx.scale(2, 2);

  const orderDate = new Date(order.createdAt).toLocaleDateString(
    lang === 'kz' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

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
 * Downloads receipt photo directly as PNG
 */
export const downloadReceiptPhoto = (
  order: Order,
  t: Translations,
  lang: Language
): boolean => {
  try {
    const canvas = createReceiptCanvas(order, t, lang);
    if (!canvas) return false;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `FoodMaxxing-Receipt-${order.orderNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch {
    return false;
  }
};

/**
 * Convert base64 dataUrl to Blob synchronously (preserves user gesture activation in Chrome/Edge)
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const binStr = atob(parts[1]);
  const len = binStr.length;
  const u8arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Returns base64 PNG data URL of the rendered receipt photo
 */
export const getReceiptDataUrl = (
  order: Order,
  t: Translations,
  lang: Language
): string | null => {
  const canvas = createReceiptCanvas(order, t, lang);
  return canvas ? canvas.toDataURL('image/png') : null;
};

/**
 * Copies receipt photo to system clipboard synchronously from user gesture
 */
export const copyReceiptPhotoToClipboard = async (
  order: Order,
  t: Translations,
  lang: Language
): Promise<boolean> => {
  try {
    const canvas = createReceiptCanvas(order, t, lang);
    if (!canvas) return false;
    const dataUrl = canvas.toDataURL('image/png');
    const blob = dataUrlToBlob(dataUrl);

    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Clipboard write failed:', err);
    return false;
  }
};

/**
 * Shares receipt photo (PNG) to WhatsApp:
 * 1. Mobile devices (iOS/Android): Uses Web Share API attaching real PNG file
 * 2. Desktop (Windows/Mac): Copies image to clipboard, downloads PNG, opens WhatsApp Web
 */
export const shareReceiptPhotoToWhatsApp = async (
  order: Order,
  t: Translations,
  lang: Language,
  recipientPhone?: string
): Promise<{ success: boolean; method: 'native_share' | 'clipboard_download' }> => {
  const canvas = createReceiptCanvas(order, t, lang);
  if (!canvas) return { success: false, method: 'clipboard_download' };

  const dataUrl = canvas.toDataURL('image/png');
  const blob = dataUrlToBlob(dataUrl);
  const fileName = `FoodMaxxing-Receipt-${order.orderNumber}.png`;
  const file = new File([blob], fileName, { type: 'image/png' });

  // ONLY use navigator.share on actual MOBILE devices (iOS/Android).
  const isMobile = typeof navigator !== 'undefined' && (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent))
  );

  if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `FoodMaxxing #${order.orderNumber}`,
        text: `Чек заказа #${order.orderNumber} (${order.requestedPickupTime})`
      });
      return { success: true, method: 'native_share' };
    } catch {
      // User cancelled share
    }
  }

  // Desktop: copy image to clipboard synchronously
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    }
  } catch {
    // Clipboard write warning
  }

  // Auto-download file
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Open WhatsApp Web with targeted phone if provided
  const cleanPhone = recipientPhone ? recipientPhone.replace(/\D/g, '') : '';
  const waUrl = cleanPhone
    ? `https://web.whatsapp.com/send?phone=${cleanPhone}`
    : 'https://web.whatsapp.com/';

  window.open(waUrl, '_blank');

  return { success: true, method: 'clipboard_download' };
};
