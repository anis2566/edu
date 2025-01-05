import { Button } from "@/components/ui/button";

interface AttachmentsProps {
    attachments: {
        title: string;
        url: string;
        id: string;
    }[];
}

export const Attachments = ({ attachments }: AttachmentsProps) => {

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-4">
            {attachments?.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md border p-2"
                >
                    <p className="text-muted-foreground">{item.title}</p>
                    <Button onClick={() => handleDownload(item.url, item.title)}>
                        Download
                    </Button>
                </div>
            ))}
        </div>
    )
}