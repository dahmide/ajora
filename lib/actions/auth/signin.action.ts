"use server";

import { auth } from "@/lib/auth";
import { signInSchema } from "@/lib/schemas/auth";
import { parseFormData } from "@/utils/functions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type SignInActionState = {
    errors?: {
        email?: string;
        password?: string;
    };
};

export async function signInAction(
    prevData: SignInActionState,
    formData: FormData
) {
    const result = parseFormData(signInSchema, formData);
    if (!result.success) {
        return { errors: result.fieldErrors };
    }
    const fields = result.data;

    try {
        const data = await auth.api.signInEmail({
            body: fields,
            headers: await headers(), // required for cookies
        });
    } catch {
        return { errors: undefined };
    }

    redirect("/");
}
