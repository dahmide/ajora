import { z } from "zod";

export const passwordSchema = z
    .string()
    .min(8, { error: "Password must be at least 8 characters" })
    .regex(/[a-z]/, {
        error: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
        error: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { error: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
        error: "Password must contain at least one special character",
    })
    .trim();