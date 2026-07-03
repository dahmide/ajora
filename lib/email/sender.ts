import { resend } from "./client";

type SendEmailProps = Pick<
    Parameters<typeof resend.emails.send>[0],
    "to" | "subject" | "react"
>;

export async function sendEmail({ to, subject, react }: SendEmailProps) {
    return resend.emails.send({
        from: process.env.EMAIL_FROM! ?? "Acme <onboarding@resend.dev>",
        to: Array.isArray(to) ? to[0] : to,
        subject: subject ?? "",
        react,
    });
}
