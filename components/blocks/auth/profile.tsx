"use client";

import { PasswordInput } from "@/components/custom/password-input";
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
import { useFormAction } from "@/hooks/use-form-action";
import { updateAction } from "@/lib/actions/auth";
import { profileSchema } from "@/lib/schemas/auth";
import { InfoIcon } from "lucide-react";
import { Controller } from "react-hook-form";

export default function ProfileForm() {
    const { control, onSubmit, isSubmitting } = useFormAction(updateAction, {
        schema: profileSchema,
        initialState: {},
        defaultValues: {
            fname: "",
            lname: "",
            password: "",
            confirm_password: "",
        },
    });
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-1 mb-6">
                <h1>Finish setting up</h1>
                <p>
                    Just a couple more details and your account will be ready.
                    Add your name and a password to get started.
                </p>
            </div>
            <FieldGroup>
                <div className="flex flex-row items-center gap-6">
                    <Controller
                        name="fname"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    First Name
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id={field.name}
                                        placeholder=""
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
                    <Controller
                        name="lname"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Last Name
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id={field.name}
                                        placeholder=""
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
                </div>
                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Password
                            </FieldLabel>
                            <InputGroup>
                                <PasswordInput
                                    {...field}
                                    id={field.name}
                                    placeholder=""
                                    disabled={isSubmitting}
                                />
                            </InputGroup>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="confirm_password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Confirm Password
                            </FieldLabel>
                            <InputGroup>
                                <PasswordInput
                                    {...field}
                                    id={field.name}
                                    placeholder=""
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
                        Confirm
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
