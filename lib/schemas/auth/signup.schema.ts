import { passwordSchema } from "./shared.schema";
import { z } from "zod";

export const emailSchema = z.object({
    email: z
        .string()
        .min(1, { error: "Email is required" })
        .pipe(z.email({ error: "Email is invalid" })),
});

export const otpSchema = z.object({
    otp: z
        .string()
        .length(6, "Enter the 6-digit code")
        .regex(/^\d+$/, "Code must contain only numbers"),
});

export const profileSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(60, "Name is too long"),
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const signUpSchema = z.object({
    ...emailSchema.shape,
    ...otpSchema.shape,
    ...profileSchema.shape,
});

export type EmailInput = z.infer<typeof emailSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
