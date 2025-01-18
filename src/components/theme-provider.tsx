"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect } from "react";
import { useState } from "react";

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <>{children}</>;
    }

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
