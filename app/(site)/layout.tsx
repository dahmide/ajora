import { Footer, Header } from "@/components/layout";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <div>{children}</div>
            <Footer />
        </>
    );
}
