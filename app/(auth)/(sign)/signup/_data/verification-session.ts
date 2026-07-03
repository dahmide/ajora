import "server-only";
import { createSession, getSession, deleteSession } from "@/lib/session";

const COOKIE_NAME = "verification_session";
const MAX_AGE_SECONDS = 60 * 10; // matches OTP expiry

type VerificationSession = { email: string };

export async function createVerificationSession(email: string) {
    await createSession<VerificationSession>(
        { email },
        { name: COOKIE_NAME, maxAgeSeconds: MAX_AGE_SECONDS, path: "/signup" }
    );
}
export async function getVerificationEmail() {
    const session = await getSession<VerificationSession>(COOKIE_NAME);
    return session?.email ?? null;
}

export async function clearVerificationSession() {
    await deleteSession(COOKIE_NAME, "/signup");
}
