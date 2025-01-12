import { useState } from "react";

import { LoadingButton } from "@/components/loading-button";

interface AttachmentsProps {
    attachments: {
        title: string;
        url: string;
        id: string;
    }[];
}

export const Attachments = ({ attachments }: AttachmentsProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDownload = async (url: string, filename: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setIsLoading(false)
            console.error("Download failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (attachments.length === 0) {
        return <p className="text-muted-foreground text-center py-4">No attachments available.</p>
    }

    return (
        <div className="space-y-4">
            {attachments?.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md border p-2"
                >
                    <p className="text-muted-foreground">{item.title}</p>
                    <LoadingButton
                        type="button"
                        isLoading={isLoading}
                        title="Download"
                        loadingTitle="Downloading..."
                        onClick={() => handleDownload(item.url, item.title)}
                    />
                </div>
            ))}
        </div>
    )
}