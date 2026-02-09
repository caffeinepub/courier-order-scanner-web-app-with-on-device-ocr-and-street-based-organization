import { Order } from './types';

const STORAGE_KEY = 'courier_orders';

export function loadOrders(): Order[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load orders:', error);
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Failed to save orders:', error);
  }
}

export function clearOrders(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear orders:', error);
  }
}
