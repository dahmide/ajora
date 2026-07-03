import { sendEmail } from "./sender";

import { WelcomeEmail } from "./template/welcome";
import { VerificationEmail } from "./template/email-verification";
import { PasswordResetEmail } from "./template/password-reset";

export function sendWelcomeMessage(email: string, name: string, url: string) {
    return sendEmail({
        to: email,
        subject: "Welcome",
        react: WelcomeEmail({ name, actionUrl: url }),
    });
}

export function sendVerificationCode(email: string, code: string) {
    return sendEmail({
        to: email,
        subject: "Your verification code",
        react: VerificationEmail({ code }),
    });
}

export function sendPasswordResetCode(email: string, code: string) {
    return sendEmail({
        to: email,
        subject: "Reset your password",
        react: PasswordResetEmail({ code }),
    });
}
