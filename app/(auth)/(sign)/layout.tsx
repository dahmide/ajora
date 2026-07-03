import Image from "next/image";

export default function SignLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col">
                <header></header>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-sm md:max-w-md">{children}</div>
                </div>
                <footer></footer>
            </div>
            <div className="relative hidden lg:flex">
                <Image
                    src="/images/placeholder.svg"
                    alt="Placeholder"
                    style={{ objectFit: "cover" }}
                    fill
                />
            </div>
        </section>
    );
}
