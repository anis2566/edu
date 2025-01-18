import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/server/action";

interface Props {
    children: React.ReactNode;
}

const AuthLayout = async ({ children }: Props) => {
    const user = await getCurrent();

    if (user) {
        return redirect("/");
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center">{children}</div>
    )
}

export default AuthLayout;