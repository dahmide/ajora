import { Container, Section } from "@/components/layout";

const steps = [
    {
        title: "Create your circle",
        description:
            "Set up your Ajo group and define the contribution amount and frequency. Done in under a minute.",
    },
    {
        title: "Members join via link",
        description:
            "Share your unique group link. As each member joins, they instantly receive their own Nomba virtual account number, no mix-ups, ever.",
    },
    {
        title: "Pay, track and repeat",
        description:
            "Members transfer to their account number. Ajora reconciles it instantly, updates the dashboard, and notifies everyone via SMS.",
    },
];

export default function HowItWorks() {
    return (
        <Section>
            <Container>How it works</Container>
        </Section>
    );
}
