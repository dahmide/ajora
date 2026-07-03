import { Container } from "@/components/layout";

const footerSocials = [];
const footerColumns = [
    {
        title: "Product",
        links: [
            { label: "How it Works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Infrastructure", href: "#infrastructure" },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Sign In", href: "/sign-in" },
            { label: "Start a Group", href: "/sign-up" },
        ],
    },
];

export default function Footer() {
    return (
        <footer>
            <Container>Footer</Container>
        </footer>
    );
}
