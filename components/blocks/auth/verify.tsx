"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useFormAction } from "@/hooks/use-form-action";
import { resendAction, verifyAction } from "@/lib/actions/auth";
import { otpSchema } from "@/lib/schemas/auth";
import { Controller } from "react-hook-form";

export default function VerifyForm({ email }: { email: string }) {
    const { control, onSubmit, isSubmitting } = useFormAction(verifyAction, {
        schema: otpSchema,
        initialState: {},
        defaultValues: {
            otp: "",
        },
    });

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-1 mb-6">
                <h1>Check your inbox</h1>
                <p>Enter the verification code we just sent to {email}</p>
            </div>
            <FieldGroup>
                <Controller
                    name="otp"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>Code</FieldLabel>
                            <InputOTP
                                id={field.name}
                                maxLength={6}
                                pattern={REGEXP_ONLY_DIGITS}
                                className="w-full"
                                value={field.value}
                                onChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                            >
                                <InputOTPGroup className="w-full *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:h-12">
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </Field>
                    )}
                />
                <Field>
                    <Button
                        type="submit"
                        variant="default"
                        disabled={isSubmitting}
                    >
                        Continue
                    </Button>
                </Field>
                <FieldDescription className="text-center">
                    Didn't receive the code?{" "}
                    <Button
                        variant="link"
                        className="p-0"
                        onClick={() => null}
                        disabled={isSubmitting}
                    >
                        Resend email
                    </Button>
                </FieldDescription>
            </FieldGroup>
        </form>
    );
}
