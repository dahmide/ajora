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
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import { getOtpAction } from "@/lib/actions/auth";
import { emailSchema } from "@/lib/schemas/auth";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { InfoIcon } from "lucide-react";
import { useFormAction } from "@/hooks/use-form-action";
import Link from "next/link";
import { Controller } from "react-hook-form";

export default function SignInForm() {
    const { control, onSubmit, isSubmitting } = useFormAction(getOtpAction, {
        schema: emailSchema,
        initialState: {},
        defaultValues: {
            email: "",
        },
    });
    return (
        <form onSubmit={onSubmit}>
            <FieldSet>
                <div className="flex flex-col gap-1">
                    <h1>Sign Up</h1>
                    <p>Sign up to your account</p>
                </div>
                <FieldGroup className="flex flex-row">
                    <Field>
                        <Button variant="outline" disabled={isSubmitting}>
                            <SiGoogle />
                            Google
                        </Button>
                    </Field>
                    <Field>
                        <Button variant="outline" disabled={isSubmitting}>
                            <SiGithub />
                            Github
                        </Button>
                    </Field>
                </FieldGroup>
                <FieldSeparator />
                <FieldGroup>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Email
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id={field.name}
                                        placeholder=""
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InfoIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Field>
                        <Button type="submit" disabled={isSubmitting}>
                            Sign Up
                        </Button>
                        <FieldDescription className="text-center">
                            Don&apos;t have an account?{" "}
                            <Link href="/signin">Sign in</Link>
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
