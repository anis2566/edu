import { create } from "zustand";

interface DeleteCourseState {
    isOpen: boolean;
    courseId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteCourse = create<DeleteCourseState>((set) => ({
    isOpen: false,
    courseId: "",
    onOpen: (id: string) => set({ isOpen: true, courseId: id }),
    onClose: () => set({ isOpen: false, courseId: "" }),
}));