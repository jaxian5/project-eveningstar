import { create } from "zustand";
import { Inventory } from "./inventory";
import { loadSample } from "./seed";
import { DEFAULT_SETTINGS, STORAGE_KEY, type AppView, type Settings } from "./types";

let engine = new Inventory({ defaultReorder: DEFAULT_SETTINGS.defaultReorder });

export function getEngine() {
  return engine;
}

type CartLine = { sku: string; qty: number };

type AppState = {
  ready: boolean;
  revision: number;
  view: AppView;
  cart: CartLine[];
  lastSaleId: number | null;
  filters: { q: string; category: string; status: string };
  billSearch: string;
  notifyOpen: boolean;
  hydrate: () => void;
  persist: () => void;
  bump: () => void;
  mutate: (fn: (inv: Inventory) => void) => void;
  setView: (view: AppView) => void;
  setFilters: (f: Partial<AppState["filters"]>) => void;
  setBillSearch: (q: string) => void;
  setCart: (cart: CartLine[]) => void;
  setLastSale: (id: number | null) => void;
  setNotifyOpen: (open: boolean) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetSample: () => void;
  importData: (obj: unknown) => { ok: true; errors: string[] };
};

function persistEngine() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(engine.toJSON()));
    return true;
  } catch {
    return false;
  }
}

export const useApp = create<AppState>((set, get) => ({
  ready: false,
  revision: 0,
  view: "inventory",
  cart: [],
  lastSaleId: null,
  filters: { q: "", category: "", status: "" },
  billSearch: "",
  notifyOpen: true,
  hydrate: () => {
    engine = new Inventory({ defaultReorder: DEFAULT_SETTINGS.defaultReorder });
    let loaded = false;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        engine.load(JSON.parse(raw));
        loaded = true;
      }
    } catch {
      loaded = false;
    }
    if (!loaded) {
      loadSample(engine);
      persistEngine();
    }
    const theme = engine.settings.theme || "light";
    document.documentElement.setAttribute("data-theme", theme);
    set({ ready: true, revision: get().revision + 1, notifyOpen: engine.settings.notificationsEnabled });
  },
  persist: () => {
    persistEngine();
  },
  bump: () => set({ revision: get().revision + 1 }),
  mutate: (fn) => {
    fn(engine);
    persistEngine();
    set({ revision: get().revision + 1 });
  },
  setView: (view) => set({ view }),
  setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
  setBillSearch: (q) => set({ billSearch: q }),
  setCart: (cart) => set({ cart }),
  setLastSale: (id) => set({ lastSaleId: id }),
  setNotifyOpen: (open) => {
    engine.settings.notificationsEnabled = open;
    persistEngine();
    set({ notifyOpen: open, revision: get().revision + 1 });
  },
  updateSettings: (patch) => {
    Object.assign(engine.settings, patch);
    if (patch.theme) document.documentElement.setAttribute("data-theme", patch.theme);
    persistEngine();
    set({
      notifyOpen: engine.settings.notificationsEnabled,
      revision: get().revision + 1,
    });
  },
  resetSample: () => {
    engine = new Inventory({ defaultReorder: DEFAULT_SETTINGS.defaultReorder });
    loadSample(engine);
    persistEngine();
    set({ cart: [], lastSaleId: null, revision: get().revision + 1 });
  },
  importData: (obj) => {
    const r = engine.importAny(obj as never);
    persistEngine();
    set({ cart: [], lastSaleId: null, revision: get().revision + 1 });
    return { ok: true, errors: r.errors || [] };
  },
}));
