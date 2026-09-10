// Israeli Teudat Zehut (national ID) checksum validation.
// Accepts 5-9 digits, pads to 9, applies the standard weighted checksum (1,2,1,2,...).
export function isValidTeudatZehut(id) {
  if (!id) return false;
  const value = String(id).trim();
  if (!/^\d{5,9}$/.test(value)) return false;
  const padded = value.padStart(9, "0");
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let product = Number(padded[i]) * (i % 2 === 0 ? 1 : 2);
    if (product > 9) product -= 9;
    sum += product;
  }
  return sum % 10 === 0;
}