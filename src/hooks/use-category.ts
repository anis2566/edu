import { create } from "zustand";

interface DeleteCategoryState {
    isOpen: boolean;
    categoryId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteCategory = create<DeleteCategoryState>((set) => ({
    isOpen: false,
    categoryId: "",
    onOpen: (id: string) => set({ isOpen: true, categoryId: id }),
    onClose: () => set({ isOpen: false, categoryId: "" }),
}));