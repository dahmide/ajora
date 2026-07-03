/**
 * Email Verification Template
 *
 * Used for email verification flows (e.g., with better-auth).
 * Contains a verification link and expiration notice.
 */

import { APP_NAME } from "@/utils/constants";
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Tailwind,
    Text,
} from "react-email";

interface VerificationEmailProps {
    /** OTP code to verify the email address */
    code: string;
    /** How long until the code expires (e.g., "24 hours") */
    expiresIn?: string;
}

export function VerificationEmail({
    code,
    expiresIn = "24 hours",
}: VerificationEmailProps) {
    return (
        <Html lang="en">
            <Head />
            <Preview>Verify your email address</Preview>

            <Tailwind>
                <Body className="bg-white font-sans">
                    <Container className="mx-auto py-12 px-4 max-w-xl">
                        <Text className="text-2xl font-bold text-black">
                            {APP_NAME}
                        </Text>

                        <Heading className="text-2xl font-bold text-gray-900 mt-8">
                            Verify your email
                        </Heading>

                        <Text className="text-base text-gray-700 leading-6">
                            Enter the code below to verify your email address
                            and complete your {APP_NAME} account setup.
                        </Text>

                        <Text className="text-3xl text-black font-bold mt-4 block">
                            {code}
                        </Text>

                        <Text className="text-sm text-gray-500 mt-4">
                            This code will expire in {expiresIn}.
                        </Text>

                        <Hr className="border-gray-200 my-8" />

                        <Text className="text-sm text-gray-500">
                            If you didn&apos;t request this verification, you
                            can safely ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}

VerificationEmail.PreviewProps = {
    code: "1234",
    expiresIn: "24 hours",
} satisfies VerificationEmailProps;

export default VerificationEmail;
