import { Navbar } from "./navbar";

interface ContentLayoutProps {
    title: string;
    children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
    return (
        <div className="w-full">
            <Navbar title={title} />
            <div className="container space-y-4 p-4">{children}</div>
        </div>
    );
}