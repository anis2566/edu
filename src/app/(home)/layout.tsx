import { getCurrent } from "@/features/auth/server/action";
import { Header } from "@/features/home/components/header";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getCurrent();

    return (
        <div className="w-full max-w-screen-xl mx-auto p-4">
            <Header user={user} />
            {children}
            {/* <Footer /> */}
        </div>
    )
};

export default HomeLayout;
