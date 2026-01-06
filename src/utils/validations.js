export function isEmail(value) {
  if (!value) return false;
  // simple regex for email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
