import { create } from "zustand";

interface HeroStore {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const useHero = create<HeroStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}));
