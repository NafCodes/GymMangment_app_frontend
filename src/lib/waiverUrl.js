export function getWaiverUrl() {
  const base = import.meta.env.VITE_APP_URL || window.location.origin;
  return `${base.replace(/\/$/, '')}/sign-waiver`;
}
