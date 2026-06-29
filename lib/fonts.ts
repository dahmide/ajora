import { Jost, Inter } from "next/font/google";

export const jost = Jost({
    subsets: ["latin"],
    variable: "--font-heading",
});

export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-body",
});
