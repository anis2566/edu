import { create } from "zustand";
import { Dispatch, SetStateAction } from "react";

interface OpenUploadState {
    isOpen: boolean;
    chapterId: string;
    courseId: string;
    setIsEditing: Dispatch<SetStateAction<boolean>> | undefined;
    onOpen: (chapterId: string, courseId: string, setIsEditing: Dispatch<SetStateAction<boolean>>) => void;
    onClose: () => void;
}

export const useOpenUpload = create<OpenUploadState>((set) => ({
    isOpen: false,
    chapterId: "",
    courseId: "",
    setIsEditing: undefined,
    onOpen: (chapterId, courseId, setIsEditing) => set({ isOpen: true, chapterId, courseId, setIsEditing }),
    onClose: () => set({ isOpen: false, chapterId: "", courseId: "", setIsEditing: undefined }),
}));


interface DeleteChapterState {
    isOpen: boolean;
    chapterId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteChapter = create<DeleteChapterState>((set) => ({
    isOpen: false,
    chapterId: "",
    onOpen: (id: string) => set({ isOpen: true, chapterId: id }),
    onClose: () => set({ isOpen: false, chapterId: "" }),
}));