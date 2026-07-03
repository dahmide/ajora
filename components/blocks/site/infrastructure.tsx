import { Container, Section } from "@/components/layout";
import { Landmark, Webhook, ArrowLeftRight } from "lucide-react";

const infrastructureItems = [
    {
        title: "Virtual Accounts",
        description:
            "Every member gets a dedicated account number the moment they join a group.",
        icon: Landmark,
        bullets: [
            "Unique account per member, per group",
            "Instant provisioning on join",
            "No manual matching required",
        ],
    },
    {
        title: "Webhooks",
        description:
            "Inbound transfers trigger instant events Ajora reconciles in real time.",
        icon: Webhook,
        snippet: 'event: "transfer.inbound"',
        bullets: [
            "Fires the moment a transfer lands",
            "Powers under/overpayment detection",
            "No polling, no delays",
        ],
    },
    {
        title: "Transactions API",
        description:
            "Full transaction history per account powers every member statement.",
        icon: ArrowLeftRight,
        bullets: [
            "Cycle-by-cycle contribution records",
            "Payout history per member",
            "Exportable statements",
        ],
    },
];

export default function Infrastructure() {
    return (
        <Section>
            <Container>Infrastructure</Container>
        </Section>
    );
}
