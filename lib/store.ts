import {
  CartActionTypes,
  CartType,
  LoginModalStore,
  SideBarDrawerStore,
} from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Sidebar state
export const useSideBarDrawer = create<SideBarDrawerStore>()((set) => ({
  isSideBarOpen: false,
  onSideBarOpen: () => set({ isSideBarOpen: true }),
  onSideBarClose: () => set({ isSideBarOpen: false }),
}));

// Login modal state
export const useLoginModal = create<LoginModalStore>()((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

// Cart state
const INITIAL_STATE = {
  menus: [],
};

export const useCartStore = create<CartType & CartActionTypes>()(
  devtools(
    persist(
      (set, get) => ({
        menus: INITIAL_STATE.menus,
        addToCart(item) {
          const menus = get().menus;
          const checkItem = menus.find((menu) => menu.id === item.id);
          if (!checkItem) {
            set({ menus: [...menus, item] });
          } else {
            set({ menus: [...menus] });
          }
        },
        deleteFromcart(itemId) {
          const menus = get().menus;
          const updatedMenus = menus.filter((menu) => menu.id !== itemId);
          set({ menus: updatedMenus });
        },
        increaseCartItem(data, id) {
          const newData = [...data];
          newData.forEach((item) => {
            if (item.id === id) item.quantity += 1;
          });
          set({ menus: newData });
        },
        decreaseCartItem(data, id) {
          const newData = [...data];
          newData.forEach((item) => {
            if (item.id === id) item.quantity -= 1;
          });
          set({ menus: newData });
        },
        resetCart() {
          set(INITIAL_STATE);
        },
      }),
      { name: "dpsresto_yt_cart", skipHydration: true }
    )
  )
);

// New Category Store for managing selectedCategoryId
interface CategoryState {
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
}

export const useCategoryStore = create<CategoryState>()(
  devtools(
    set => ({
      selectedCategoryId: null,
      setSelectedCategoryId: (id: string | null) => set({ selectedCategoryId: id }),
    }),
    { name: "category-store" }
  )
);
