import { create } from "zustand";

interface OpenUploadState {
    isOpen: boolean;
    chapterId: string;
    onOpen: (chapterId: string) => void;
    onClose: () => void;
}

export const useOpenUpload = create<OpenUploadState>((set) => ({
    isOpen: false,
    chapterId: "",
    onOpen: (chapterId) => set({ isOpen: true, chapterId }),
    onClose: () => set({ isOpen: false, chapterId: "" }),
}));