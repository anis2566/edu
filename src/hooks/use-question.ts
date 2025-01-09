import { Question, QuestionAnswer, User } from "@prisma/client";
import { create } from "zustand";

interface AddQuestionState {
    isOpen: boolean;
    chapterId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useAddQuestion = create<AddQuestionState>((set) => ({
    isOpen: false,
    chapterId: "",
    onOpen: (id: string) => set({ isOpen: true, chapterId: id }),
    onClose: () => set({ isOpen: false, chapterId: "" }),
}));

type UserWithExtended = Omit<User, 'createdAt' | 'updatedAt' | 'emailVerified'> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
};

type QuestionAnswerExtended = Omit<QuestionAnswer, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
    user: UserWithExtended;
};

type QuestionWithExtended = Omit<Question, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
    user: UserWithExtended;
    answers: QuestionAnswerExtended[];
};

interface ViewQuestionState {
    isOpen: boolean;
    question: QuestionWithExtended | null
    onOpen: (question: QuestionWithExtended) => void;
    onClose: () => void;
}

export const useViewQuestion = create<ViewQuestionState>((set) => ({
    isOpen: false,
    question: null,
    onOpen: (question) => set({ isOpen: true, question }),
    onClose: () => set({ isOpen: false, question: null }),
}));

interface QuestionReplyState {
    isOpen: boolean;
    question: QuestionWithExtended | null;
    questionId: string;
    onOpen: (question: QuestionWithExtended, id: string) => void;
    onClose: () => void;
}

export const useQuestionReply = create<QuestionReplyState>((set) => ({
    isOpen: false,
    questionId: "",
    question: null,
    onOpen: (question, id) => set({ isOpen: true, questionId: id, question }),
    onClose: () => set({ isOpen: false, questionId: "", question: null }),
}));

interface QuestionReplyUserState {
    isOpen: boolean;
    questionId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useQuestionReplyUser = create<QuestionReplyUserState>((set) => ({
    isOpen: false,
    questionId: "",
    onOpen: (id: string) => set({ isOpen: true, questionId: id }),
    onClose: () => set({ isOpen: false, questionId: "" }),
}));

interface DeleteQuestionState {
    isOpen: boolean;
    questionId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteQuestion = create<DeleteQuestionState>((set) => ({
    isOpen: false,
    questionId: "",
    onOpen: (id: string) => set({ isOpen: true, questionId: id }),
    onClose: () => set({ isOpen: false, questionId: "" }),
}));


interface DeleteAnswerState {
    isOpen: boolean;
    answerId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteAnswer = create<DeleteAnswerState>((set) => ({
    isOpen: false,
    answerId: "",
    onOpen: (id: string) => set({ isOpen: true, answerId: id }),
    onClose: () => set({ isOpen: false, answerId: "" }),
}))
