"use server";

import {
    createVerificationSession,
    getVerificationEmail,
} from "@/app/(auth)/(sign)/signup/_data/verification-session";
import { user } from "@/db/schema/auth";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { emailSchema, otpSchema, profileSchema } from "@/lib/schemas/auth";
import { parseFormData } from "@/utils/functions";
import { eq } from "drizzle-orm";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";

export async function resendAction() {
    return null;
}

export async function getOtpAction(prevData: any, formData: FormData) {
    const result = parseFormData(emailSchema, formData);
    if (!result.success) {
        return { error: "" };
    }
    const fields = result.data;

    try {
        await auth.api.sendVerificationOTP({
            body: {
                email: fields.email, // required
                type: "sign-in", // required
            },
        });
        await createVerificationSession(fields.email);
    } catch {
        return { error: "" };
    }
    redirect("/signup/verify");
}

export async function verifyAction(prevData: any, formData: FormData) {
    const email = await getVerificationEmail();
    if (!email) {
        redirect("/signup");
    }
    const result = parseFormData(otpSchema, formData);
    if (!result.success) {
        return { error: "" };
    }
    const fields = result.data;

    try {
        await auth.api.signInEmailOTP({
            body: {
                email: email, // required
                otp: fields.otp, // required
            },
        });
    } catch {
        return { error: "" };
    }
    redirect("/signup/profile");
}

export async function updateAction(prevData: any, formData: FormData) {
    const result = parseFormData(profileSchema, formData);
    if (!result.success) {
        return { error: "" };
    }
    const fields = result.data;
    const headers = await nextHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
        return { error: "" };
    }

    try {
        await auth.api.setPassword({
            body: { newPassword: fields.password },
            headers: headers,
        });
        const name = `${fields.fname} ${fields.lname}`; // required
        await auth.api.updateUser({
            body: { name },
            headers: headers,
        });
        await db
            .update(user)
            .set({ profileCompleted: true })
            .where(eq(user.id, session.user.id));
    } catch {
        return { error: "" };
    }
    redirect("/");
}
