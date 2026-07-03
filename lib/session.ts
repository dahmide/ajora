// lib/session.ts
import "server-only";
import { cookies } from "next/headers";

type CookieOptions = {
    name: string;
    maxAgeSeconds: number;
    path?: string;
};

export async function createSession<T extends object>(
    payload: T,
    options: CookieOptions
) {
    const cookieStore = await cookies();

    cookieStore.set(options.name, JSON.stringify(payload), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: options.maxAgeSeconds,
        path: options.path ?? "/",
    });
}

export async function getSession<T>(name: string): Promise<T | null> {
    const cookieStore = await cookies();
    const raw = cookieStore.get(name)?.value;
    if (!raw) return null;

    try {
        return JSON.parse(raw) as T;
    } catch {
        return null; // malformed, ignore rather than throw
    }
}

export async function deleteSession(name: string, path = "/") {
    const cookieStore = await cookies();
    cookieStore.delete({ name, path });
}
