/**
 * Formats user phone input dynamically into exact Kazakhstan format:
 * +7(xxx)xxx xx xx
 * Maximum 10 digits after +7. Cannot type more than 10 digits.
 */
export function formatPhoneNumber(input: string): string {
  if (!input) return '';

  const rawDigits = input.replace(/\D/g, '');
  if (!rawDigits) return '';

  let digits = rawDigits;
  // If user pasted or typed 7 or 8 as first digit, strip it
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1);
  }

  // Strictly maximum 10 digits after +7
  digits = digits.slice(0, 10);
  if (!digits) return '+7(';

  let formatted = '+7(';
  if (digits.length < 3) {
    formatted += digits;
  } else if (digits.length <= 6) {
    formatted += `${digits.slice(0, 3)})${digits.slice(3)}`;
  } else if (digits.length <= 8) {
    formatted += `${digits.slice(0, 3)})${digits.slice(3, 6)} ${digits.slice(6)}`;
  } else {
    formatted += `${digits.slice(0, 3)})${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }

  return formatted;
}

/**
 * Checks whether user has entered all 10 digits of their mobile phone number
 */
export function isPhoneValid(phone: string): boolean {
  if (!phone) return false;
  const rawDigits = phone.replace(/\D/g, '');
  if (rawDigits.startsWith('7') || rawDigits.startsWith('8')) {
    return rawDigits.slice(1).length === 10;
  }
  return rawDigits.length === 10;
}

/**
 * Strips all non-digit characters and standardizes country code (removes leading 7 or 8)
 * Returns the core 10 digits, e.g. "7083210182"
 */
export function normalizePhoneDigits(phone?: string | null): string {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    digits = digits.slice(1);
  }
  return digits;
}

/**
 * Checks whether two phone representations refer to the exact same mobile number
 */
export function phonesMatch(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  const da = normalizePhoneDigits(a);
  const db = normalizePhoneDigits(b);
  return da.length === 10 && db.length === 10 && da === db;
}

export const ADMIN_PHONE = '+7(708)321 01 82';
export const ADMIN_PHONE_RAW = '7083210182';

/**
 * Checks whether phone belongs to FoodMaxxing Super Admin
 */
export function isAdminPhone(phone?: string | null): boolean {
  if (!phone) return false;
  return normalizePhoneDigits(phone) === ADMIN_PHONE_RAW;
}
