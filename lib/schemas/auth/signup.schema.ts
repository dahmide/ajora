import { emailSchema as email, passwordSchema } from "./shared.schema";
import { z } from "zod";

export const emailSchema = z.object({
    email: email,
});

export const otpSchema = z.object({
    otp: z
        .string()
        .length(6, "Enter the 6-digit code")
        .regex(/^\d+$/, "Code must contain only numbers"),
});

export const profileSchema = z
    .object({
        fname: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(60, "Name is too long"),
        lname: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(60, "Name is too long"),
        password: passwordSchema,
        confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
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
