import "server-only";
import { createSession, getSession, deleteSession } from "@/lib/session";

const COOKIE_NAME = "pending_signup";
const MAX_AGE_SECONDS = 60 * 10; // 10 min, matches OTP expiry

type PendingSignup = { email: string };

export async function createPendingSignup(email: string) {
    await createSession<PendingSignup>(
        { email },
        { name: COOKIE_NAME, maxAgeSeconds: MAX_AGE_SECONDS, path: "/signup" }
    );
}

export async function getPendingSignupEmail() {
    const session = await getSession<PendingSignup>(COOKIE_NAME);
    return session?.email ?? null;
}

export async function clearPendingSignup() {
    await deleteSession(COOKIE_NAME, "/signup");
}
