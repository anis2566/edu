import { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = {
    title: "EduConnect | Sign Up",
    description: "Create an account",
}

const SignUp = async () => {
    // const user = await getCurrent();

    // if (user) {
    //     return redirect("/");
    // }

    return (
        <SignUpForm />
    )

}

export default SignUp