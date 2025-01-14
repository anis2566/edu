import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/features/user/components/content-layout";
import { getCurrent } from "@/features/auth/server/action";
import { db } from "@/lib/db";
import { PersonalInfoForm } from "@/features/user/profile/components/personal-info-form";
import { AccountForm } from "@/features/user/profile/components/account-form";
import { AvatarForm } from "@/features/user/profile/components/avatar-form";
import { PasswordForm } from "@/features/user/profile/components/password-form";

export const metadata: Metadata = {
    title: "EduConnect | Profile",
    description: "Next generatation learning platform.",
};

const Profile = async () => {
    const user = await getCurrent();

    if (!user) {
        return redirect("/auth/sign-in");
    }

    const userData = await db.user.findUnique({
        where: {
            id: user.userId
        },
    });

    if (!userData) {
        return redirect("/auth/sign-in");
    }

    return (
        <ContentLayout title="Profile">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/user">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Profile</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-5">
                <PersonalInfoForm user={userData} />
                <AccountForm user={userData} />
                <AvatarForm user={userData} />
                <PasswordForm />
            </div>
        </ContentLayout>
    );
};

export default Profile;