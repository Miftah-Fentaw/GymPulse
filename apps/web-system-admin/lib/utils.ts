import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function asList<T = any>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];
  for (const key of ['items', 'users', 'admins', 'orders', 'products', 'workouts', 'programs', 'categories']) {
    if (Array.isArray(data[key])) return data[key];
  }
  return [];
}

export function countValue(v: any): number {
  if (v == null || v === false) return 0;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return 0;
    if (v[0] && typeof v[0] === 'object' && 'count' in v[0]) return countValue(v[0].count);
    return v.length;
  }
  if (typeof v === 'object' && 'count' in v) return countValue(v.count);
  return 0;
}
