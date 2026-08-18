export const LOW_STOCK_KEY = 'gympulse_shop_low_stock_threshold';
export const DEFAULT_LOW_STOCK = 10;

export function getLowStockThreshold(): number {
  if (typeof window === 'undefined') return DEFAULT_LOW_STOCK;
  const n = Number(localStorage.getItem(LOW_STOCK_KEY));
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_LOW_STOCK;
}

export function setLowStockThreshold(n: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOW_STOCK_KEY, String(n));
}

export function asArray<T = any>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
  }
  return [];
}

export function firstRecord(data: unknown): any | null {
  if (Array.isArray(data)) return data[0] ?? null;
  if (data && typeof data === 'object') return data;
  return null;
}

export function categoryName(item: any): string {
  const c = item?.product_categories;
  if (typeof c === 'string') return c;
  if (Array.isArray(c) && c[0]?.name) return c[0].name;
  if (c?.name) return c.name;
  return '—';
}

export function money(n: number | string | null | undefined): string {
  const v = Number(n);
  if (!Number.isFinite(v)) return '$0.00';
  return `$${v.toFixed(2)}`;
}

export function formatDate(v: string | null | undefined): string {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function shortId(id: string | null | undefined): string {
  if (!id) return '—';
  return id.length > 8 ? id.slice(0, 8) : id;
}

export function isLowStock(stock: number, threshold = DEFAULT_LOW_STOCK): boolean {
  return stock > 0 && stock <= threshold;
}

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const;
export const RETURN_STATUSES = ['pending', 'approved', 'rejected', 'refunded'] as const;
export const SHIPMENT_STATUSES = ['pending', 'in_transit', 'delivered', 'failed'] as const;

export function statusBadge(status: string): string {
  const map: Record<string, string> = {
    delivered: 'badge-success',
    approved: 'badge-success',
    refunded: 'badge-info',
    processing: 'badge-info',
    in_transit: 'badge-info',
    pending: 'badge-warning',
    shipped: 'badge-violet',
    cancelled: 'badge-danger',
    rejected: 'badge-danger',
    failed: 'badge-danger',
    active: 'badge-success',
    inactive: 'badge-neutral',
    flagged: 'badge-danger',
  };
  return map[status] || 'badge-neutral';
}

export function labelStatus(status: string | null | undefined): string {
  if (!status) return '—';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
