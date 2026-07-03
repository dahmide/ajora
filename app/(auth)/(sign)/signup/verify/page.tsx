import { VerifyForm } from "@/components/blocks/auth";
import { getVerificationEmail } from "../_data/verification-session";
import { redirect } from "next/navigation";

export default async function Verify() {
    const email = await getVerificationEmail();
    if (!email) {
        redirect("/signup");
    }

    return <VerifyForm email={email} />;
}
