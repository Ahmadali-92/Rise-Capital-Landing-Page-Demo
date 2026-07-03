'use client';

// sessionStorage-backed demo cart. Shares the same key EquipmentDetail already
// reads rental dates from, so the detail page and checkout stay in sync with
// no backend.
import {useCallback, useEffect, useState} from 'react';

export const CART_STORAGE_KEY = 'por_cart_items';

export interface CartItem {
  id: string;
  from: string; // ISO date
  to: string; // ISO date
  qty: number;
}

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<CartItem>[]) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i): i is CartItem => Boolean(i && i.id && i.from && i.to))
      .map((i) => ({...i, qty: Math.max(1, Number(i.qty) || 1)}));
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full/unavailable — demo cart just won't persist
  }
}

// Add (or replace, when the same asset is re-reserved) a cart line.
export function addCartItem(item: CartItem) {
  const items = readCart().filter((i) => i.id !== item.id);
  items.push(item);
  writeCart(items);
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  // Cart lives in sessionStorage, so the first client render is intentionally
  // empty; `hydrated` lets the UI show skeletons instead of a false empty state.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setHydrated(true);
  }, []);

  const update = useCallback((next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  }, []);

  const setQty = useCallback(
    (id: string, qty: number) => {
      update(
        readCart().map((i) =>
          i.id === id ? {...i, qty: Math.min(5, Math.max(1, qty))} : i
        )
      );
    },
    [update]
  );

  const removeItem = useCallback(
    (id: string) => {
      update(readCart().filter((i) => i.id !== id));
    },
    [update]
  );

  const clear = useCallback(() => update([]), [update]);

  return {items, hydrated, setQty, removeItem, clear};
}
