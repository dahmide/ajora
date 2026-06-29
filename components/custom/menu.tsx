"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";

type MenuState = "open" | "closed" | "closing";
type MenuProps = Partial<{
    className: string;
    open: boolean;
    color: React.CSSProperties["color"];
    delay: number;
    onOpenChange: (open: boolean) => void;
    easing: string;
    timing: number;
    variant: "thin" | "normal" | "bold";
}>;

const bar1Variants = {};
const bar2Variants = {};
const bar3Variants = {};

export function Menu({
    className,
    color = "black",
    delay = 0,
    easing,
    timing = 300,
    open = false,
    onOpenChange,
    variant = "normal",
}: MenuProps) {
    const [status, setStatus] = useState<MenuState>("closed");
    const handleMenuChange = () => {
        setStatus((prev) => (prev === "open" ? "closing" : "open"));
        if (onOpenChange) {
            onOpenChange(status === "open");
        }
    };
    return (
        <div className={cn("", className)} onClick={() => handleMenuChange()}>
            <div>
                <motion.span
                    className=""
                    variants={bar1Variants}
                    animate={status}
                    initial="closed"
                />
                <motion.span
                    className=""
                    variants={bar2Variants}
                    animate={status}
                    initial="closed"
                />
                <motion.span
                    className=""
                    variants={bar3Variants}
                    animate={status}
                    initial="closed"
                />
            </div>
        </div>
    );
}
