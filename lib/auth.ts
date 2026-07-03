import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { sendPasswordResetCode, sendVerificationCode } from "./email";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    user: {
        additionalFields: {
            profileCompleted: {
                type: "boolean",
                input: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                console.log("Sending OTP to:", email, "Type:", type);
                if (type === "sign-in") {
                    // Send the OTP for sign in
                    void sendVerificationCode(email, otp);
                } else if (type === "forget-password") {
                    // Send the OTP for password reset
                    void sendPasswordResetCode(email, otp);
                } else {
                    // Send the OTP for email verification
                }
            },
        }),
        nextCookies(),
    ],
});
