import {
    Cta,
    Features,
    Hero,
    HowItWorks,
    Infrastructure,
} from "@/components/blocks/site";

export default function Site() {
    return (
        <>
            <Hero />
            <HowItWorks />
            <Features />
            <Infrastructure />
            <Cta />
        </>
    );
}
