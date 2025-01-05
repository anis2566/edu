"use client";

import { Upload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";

interface ImageUploaderProps {
    preset: string;
    onChange: (values: string[]) => void;
    multiple?: boolean;
    type?: string;
    disabled?: boolean;
    clientAllowedFormats?: string[];
}

export const ImageUploader = ({ preset, onChange, multiple = false, type = "image", disabled = false, clientAllowedFormats = ["image"] }: ImageUploaderProps) => {

    return (
        <CldUploadWidget
            uploadPreset={preset}
            options={{
                resourceType: type,
                multiple,
                clientAllowedFormats,
            }}
            onQueuesEnd={(result, { widget }) => {
                const info = result.info
                if (info && typeof info === "object") {
                    const files = info.files as { uploadInfo: { secure_url: string } }[]
                    console.log(files)
                    if (files) {
                        const secureUrls = files.map((file) => file.uploadInfo.secure_url)
                        onChange(secureUrls)
                    }
                }
                widget.close();
            }}
            onError={() => {
                toast.error("Faild to upload")
            }}
        >
            {({ open }) => (
                <div
                    className="relative flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 w-full visually-hidden-focusable h-full"
                    onClick={() => !disabled && open()}
                >
                    <div className="text-center">
                        <div className="border p-2 rounded-md max-w-min mx-auto">
                            <Upload className="h-5 w-5" />
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Select Image / Images</span>
                        </p>
                    </div>
                </div>
            )}
        </CldUploadWidget>
    );
};