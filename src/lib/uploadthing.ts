import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    }).onUploadComplete((data) => {
        console.log("Upload completed", data);
    }),
    pdfUploader: f({
        pdf: {
            maxFileSize: "128MB",
            maxFileCount: 1,
        },
    }).onUploadComplete((data) => {
        console.log("Upload completed", data);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;