export const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const today = () => new Date().toISOString().slice(0, 10);

export const fmtDate = (d?: string | null): string => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return d || '';
  }
};

export const fmtTime = (t?: string | null): string => {
  if (!t) return '';
  try {
    const [h, m] = t.split(':');
    const hr = parseInt(h, 10);
    if (isNaN(hr)) return t;
    const period = hr < 12 ? 'AM' : 'PM';
    const hour12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
    return `${hour12}:${m || '00'} ${period}`;
  } catch {
    return t || '';
  }
};

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};
