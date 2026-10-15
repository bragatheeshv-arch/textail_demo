import { create } from 'zustand';

interface WishState { ids: string[]; toggle: (id: string) => void; has: (id: string) => boolean; clear: () => void }

function loadIds(): string[] {
  try {
    const raw = localStorage.getItem('af-wish');
    const v = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}

export const useWishlist = create<WishState>()((set, get) => ({
  ids: typeof window !== 'undefined' ? loadIds() : [],
  toggle: (id) => set((s) => {
    const ids = s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id];
    try { localStorage.setItem('af-wish', JSON.stringify(ids)); } catch { /* noop */ }
    return { ids };
  }),
  has: (id) => get().ids.includes(id),
  clear: () => set(() => {
    try { localStorage.removeItem('af-wish'); } catch { /* noop */ }
    return { ids: [] };
  }),
}));

interface UIState {
  cartOpen: boolean; searchOpen: boolean; mobileNavOpen: boolean; toast: string | null;
  setCartOpen: (v: boolean) => void; setSearchOpen: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void; showToast: (msg: string) => void;
}

export const useUI = create<UIState>()((set) => ({
  cartOpen: false, searchOpen: false, mobileNavOpen: false, toast: null,
  setCartOpen: (v) => set({ cartOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
  showToast: (msg) => {
    set({ toast: msg });
    window.setTimeout(() => set({ toast: null }), 2600);
  },
}));
