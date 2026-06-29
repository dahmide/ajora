import { Section } from "@/components/layout";
import Image from "next/image";

export default function SignLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Section>
            <div>
                <header></header>
                {children}
                <footer></footer>
            </div>
            <div className="relative">
                <Image src="" alt="" fill />
            </div>
        </Section>
    );
}
