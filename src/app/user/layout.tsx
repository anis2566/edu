import { UserLayout } from "@/features/user/components/dashboard-layout";

interface UserLayoutProps {
    children: React.ReactNode;
}

const UserLayoutPage = ({ children }: UserLayoutProps) => {
    return <UserLayout>{children}</UserLayout>;
}

export default UserLayoutPage;