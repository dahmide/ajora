import { z } from "zod";
import { passwordSchema } from "./shared.schema";

export const signInSchema = z.object({
    email: z
        .string()
        .min(1, { error: "Email is required" })
        .pipe(z.email({ error: "Email is invalid" })),
    password: passwordSchema,
});

export type SignInInput = z.infer<typeof signInSchema>;
