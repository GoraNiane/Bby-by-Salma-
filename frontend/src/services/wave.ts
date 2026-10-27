export const DEFAULT_WAVE_PAYMENT_URL = 'https://pay.wave.com/m/M_sn_UoRxc-HJ7lK-/c/sn/';

/**
 * Builds the Wave deep link with the prescribed amount prefilled.
 * When a buyer clicks this link on their smartphone or browser,
 * the Wave application opens with the merchant and the exact amount already set.
 * The buyer only has to validate the transaction.
 *
 * @param amount Total order amount in FCFA (XOF)
 * @param customBaseUrl Optional custom merchant link
 * @returns Full Wave payment link
 */
export const buildWavePaymentUrl = (amount: number, customBaseUrl?: string): string => {
  const base = (customBaseUrl && customBaseUrl.trim()) || DEFAULT_WAVE_PAYMENT_URL;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const roundedAmount = Math.max(0, Math.round(amount));
  return `${cleanBase}?amount=${roundedAmount}`;
};
