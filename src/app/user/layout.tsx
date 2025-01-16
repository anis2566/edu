import { AppKnockProviders } from "@/components/knock-provider";
import { getCurrent } from "@/features/auth/server/action";
import { UserLayout } from "@/features/user/components/dashboard-layout";

interface UserLayoutProps {
    children: React.ReactNode;
}

const UserLayoutPage = async ({ children }: UserLayoutProps) => {
    const user = await getCurrent();

    if (!user) {
        return null;
    }

    return (
        <AppKnockProviders userId={user.userId}>
            <UserLayout>{children}</UserLayout>
        </AppKnockProviders>
    )
}

export default UserLayoutPage;