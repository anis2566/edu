"use client";

import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ColourfulText } from "@/components/ui/colorful-text";
import { HyperText } from "@/components/ui/hyper-text";
import { useCurrent } from "@/features/auth/api/use-current";

export const Hero = () => {
    const { theme } = useTheme();
    const { data: currentUser } = useCurrent();

    return (
        <section className="container">
            <div className="mx-auto w-full max-w-screen-xl place-items-center space-y-8 py-[100px]">
                <div className="mx-auto max-w-screen-xl text-center text-3xl font-bold md:text-5xl">
                    <HyperText duration={200} delay={10000}>Empower Your Learning Journey</HyperText>
                    <h1>
                        <span className="bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text text-transparent">
                            {" "}
                            <ColourfulText text="EduConnect" />
                        </span>
                    </h1>
                </div>

                <p className="mx-auto max-w-screen-sm text-center text-sm text-muted-foreground md:text-xl">
                    Discover a world of knowledge with our cutting-edge LMS. Access
                    high-quality courses, interact with expert instructors, and enhance
                    your skills from anywhere, at any time. Don&apos;t miss this
                    opportunity to transform your learning experience!
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Button variant="secondary" className="font-bold" asChild>
                        <Link href="/courses">Explore Courses</Link>
                    </Button>
                    {
                        !currentUser && (
                            <Button className="group/arrow font-bold" asChild>
                                <Link href="/auth/sign-up">
                                    Get Started
                                    <ArrowRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
                                </Link>
                            </Button>
                        )
                    }
                </div>

                <div className="group relative">
                    <div className="img-shadow-animation absolute -top-6 right-12 h-12 w-[90%] rounded-full bg-primary/50 blur-3xl lg:h-[80%]" />

                    <div className="relative">
                        <img
                            className="rouded-lg img-border-animation relative mx-auto flex w-full items-center rounded-lg border border-t-2 border-t-primary/30 leading-none md:w-[1240px]"
                            alt="EduConnect LMS Dashboard"
                            src={theme === "dark" ? "/dark-banner.png" : "/light-banner1.png"}
                        />
                    </div>
                    <div className="absolute bottom-0 left-0 h-20 w-full rounded-lg bg-gradient-to-b from-background/0 via-background/50 to-background md:h-28" />
                </div>
            </div>
        </section>
    );
};