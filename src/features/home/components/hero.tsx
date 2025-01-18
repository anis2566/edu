"use client";

import { ArrowRight, Play } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useHero } from "@/hooks/use-hero";

export const Hero = () => {
    const { theme } = useTheme();
    const { setIsOpen } = useHero();

    return (
        <section className="container">
            <div className="mx-auto w-full max-w-screen-xl place-items-center space-y-8 py-[100px]">
                <div className="space-y-8 text-center">
                    <Badge variant="outline" className="rounded-full py-2 text-sm">
                        <span className="mr-2 text-primary">
                            <Badge className="rounded-full">New</Badge>
                        </span>
                        <span>Interactive Courses</span>
                    </Badge>
                </div>

                <div className="mx-auto max-w-screen-xl text-center text-3xl font-bold md:text-5xl">
                    <h1>Empower Your Learning Journey</h1>
                    <h1>
                        <span className="bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text text-transparent">
                            {" "}
                            E-Learn{" "}
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
                    <Button className="group/arrow font-bold" asChild>
                        <Link href="/auth/sign-up">
                            Get Started
                            <ArrowRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                <div className="group relative">
                    <div className="img-shadow-animation absolute -top-6 right-12 h-12 w-[90%] rounded-full bg-primary/50 blur-3xl lg:h-[80%]" />

                    <div className="relative">
                        <img
                            className="rouded-lg img-border-animation relative mx-auto flex w-full items-center rounded-lg border border-t-2 border-t-primary/30 leading-none md:w-[1200px]"
                            alt="EduConnect LMS Dashboard"
                            src={theme === "dark" ? "/dark-banner.png" : "/light-banner1.png"}
                        />
                        <div className="absolute top-[40%] left-[42%] -translate-x-[42%] -translate-y-[40%] w-[80px] h-[80px] rounded-full bg-red-600 blur-xs flex items-center justify-center z-50 cursor-pointer" onClick={() => setIsOpen(true)}>
                            <Play className="size-10 text-white" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-20 w-full rounded-lg bg-gradient-to-b from-background/0 via-background/50 to-background md:h-28" />
                </div>
            </div>
        </section>
    );
};