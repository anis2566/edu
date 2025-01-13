import { Submission, SubmissionStatus } from "@prisma/client";
import { create } from "zustand";

interface SubmissionState {
    isOpen: boolean;
    assignmentId: string;
    onOpen: (assignmentId: string) => void;
    onClose: () => void;
}

export const useSubmission = create<SubmissionState>((set) => ({
    isOpen: false,
    assignmentId: "",
    onOpen: (assignmentId: string) => set({ isOpen: true, assignmentId }),
    onClose: () => set({ isOpen: false, assignmentId: "" }),
}));


type SubmissionExtended = Omit<Submission, "createdAt" | "updatedAt"> & {
    courseTitle: string;
    chapterTitle: string;
};

interface SubmissionViewState {
    isOpen: boolean;
    submission: SubmissionExtended | null;
    onOpen: (submission: SubmissionExtended) => void;
    onClose: () => void;
}

export const useSubmissionView = create<SubmissionViewState>((set) => ({
    isOpen: false,
    submission: null,
    onOpen: (submission: SubmissionExtended) => set({ isOpen: true, submission }),
    onClose: () => set({ isOpen: false, submission: null }),
}));


type SubmissionExtendedAdmin = Omit<Submission, "createdAt" | "updatedAt"> & {
    courseTitle: string;
    chapterTitle: string;
    assignmentUrl: string;
};

interface SubmissionViewStateAdmin {
    isOpen: boolean;
    submission: SubmissionExtendedAdmin | null;
    onOpen: (submission: SubmissionExtendedAdmin) => void;
    onClose: () => void;
}

export const useSubmissionViewAdmin = create<SubmissionViewStateAdmin>((set) => ({
    isOpen: false,
    submission: null,
    onOpen: (submission: SubmissionExtendedAdmin) => set({ isOpen: true, submission }),
    onClose: () => set({ isOpen: false, submission: null }),
}));


interface SubmissionStatusState {
    isOpen: boolean;
    submissionId: string;
    status: SubmissionStatus;
    onOpen: (submissionId: string, status: SubmissionStatus) => void;
    onClose: () => void;
}

export const useSubmissionStatus = create<SubmissionStatusState>((set) => ({
    isOpen: false,
    submissionId: "",
    status: SubmissionStatus.Pending,
    onOpen: (submissionId: string, status: SubmissionStatus) => set({ isOpen: true, submissionId, status }),
    onClose: () => set({ isOpen: false, submissionId: "", status: SubmissionStatus.Pending }),
}));


interface DeleteSubmissionState {
    isOpen: boolean;
    submissionId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteSubmission = create<DeleteSubmissionState>((set) => ({
    isOpen: false,
    submissionId: "",
    onOpen: (id: string) => set({ isOpen: true, submissionId: id }),
    onClose: () => set({ isOpen: false, submissionId: "" }),
}));
