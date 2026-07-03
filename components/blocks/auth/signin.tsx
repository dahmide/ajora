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
import { PasswordInput as InputGroupPassword } from "@/components/custom/password-input";
import { signInAction } from "@/lib/actions/auth";
import { signInSchema } from "@/lib/schemas/auth";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { InfoIcon } from "lucide-react";
import { useFormAction } from "@/hooks/use-form-action";
import Link from "next/link";
import { Controller } from "react-hook-form";

export default function SignInForm() {
    const { control, onSubmit, isSubmitting } = useFormAction(signInAction, {
        schema: signInSchema,
        initialState: {},
        defaultValues: {
            email: "",
            password: "",
        },
    });
    return (
        <form onSubmit={onSubmit}>
            <FieldSet>
                <div className="flex flex-col gap-1">
                    <h1>Sign In</h1>
                    <p>Sign in to your account</p>
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
                                        placeholder="johndoe@gmail.com"
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
                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Password
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupPassword
                                        {...field}
                                        placeholder="johndoe@123456"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Field>
                        <Button type="submit" disabled={isSubmitting}>
                            Sign In
                        </Button>
                        <FieldDescription className="text-center">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup">Sign up</Link>
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
