import { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = {
    title: "EduConnect | Sign In",
    description: "Sign in to your account",
}

const SignIn = async () => {
    // const user = await getCurrent();

    // if (user) {
    //     return redirect("/");
    // }

    return (
        <SignInForm />
    )

}

export default SignIn