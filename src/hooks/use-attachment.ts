import { create } from "zustand";

interface DeleteAttachmentState {
    isOpen: boolean;
    attachmentId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteAttachment = create<DeleteAttachmentState>((set) => ({
    isOpen: false,
    attachmentId: "",
    onOpen: (id: string) => set({ isOpen: true, attachmentId: id }),
    onClose: () => set({ isOpen: false, attachmentId: "" }),
}));