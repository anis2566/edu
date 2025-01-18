"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useHero } from "@/hooks/use-hero";

export const HeroModal = () => {
    const { isOpen, setIsOpen } = useHero();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <div className="relative">
                    <video src="/sample.mp4" autoPlay loop muted className="w-full h-full object-cover" />
                </div>
            </DialogContent>
        </Dialog>
    )
};
