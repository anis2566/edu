import { Metadata } from "next";
import { Suspense } from "react";

import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = {
    title: "EduConnect | Sign Up",
    description: "Create an account",
}

const SignUp = async () => {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignUpForm />
        </Suspense>
    )

}

export default SignUp