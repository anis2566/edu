import { Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = {
    title: "EduConnect | Sign In",
    description: "Sign in to your account",
}

const SignIn = async () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignInForm />
        </Suspense>
    )

}

export default SignIn