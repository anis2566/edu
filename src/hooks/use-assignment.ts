import { create } from "zustand";

interface DeleteAssignmentState {
    isOpen: boolean;
    assignmentId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteAssignment = create<DeleteAssignmentState>((set) => ({
    isOpen: false,
    assignmentId: "",
    onOpen: (id: string) => set({ isOpen: true, assignmentId: id }),
    onClose: () => set({ isOpen: false, assignmentId: "" }),
}));

