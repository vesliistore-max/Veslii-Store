export function formatPKR(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return 'Rs. 0';
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function calculateDiscount(price: number, originalPrice?: number): string | null {
  if (!originalPrice || originalPrice <= price) return null;
  const percentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  return `${percentage}% OFF`;
}

export function validatePKPhone(phone: string): boolean {
  const clean = phone.replace(/[\s-]/g, '');
  // Accepts 03XXXXXXXXX or +923XXXXXXXXX or 00923XXXXXXXXX
  const regex = /^(\+92|0092|03)[0-9]{9}$/;
  return regex.test(clean);
}
