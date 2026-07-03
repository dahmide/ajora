"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

type FieldErrors = Record<string, string>;
type FieldError = {
    message: string;
    invalid: boolean;
};
type EnrichedFieldErrors = Record<string, FieldError>;

type FormAction<TState> = (
    prevData: TState,
    formData: FormData
) => TState | Promise<TState>;

type UseFormActionOptions<TState, TFields extends FieldValues> = {
    initialState: Awaited<TState>;
    schema: ZodType<FieldValues["input"], any, FieldValues["output"]>;
    defaultValues: DefaultValues<TFields["input"]>;
};

function enrichErrors(raw: FieldErrors): EnrichedFieldErrors {
    return Object.fromEntries(
        Object.entries(raw).map(([key, message]) => [
            key,
            { message, invalid: true },
        ])
    );
}

export function useFormAction<
    TState extends { errors?: FieldErrors },
    TFields extends FieldValues
>(
    action: FormAction<TState>,
    {
        schema,
        initialState,
        defaultValues,
    }: UseFormActionOptions<TState, TFields>
) {
    const form = useForm<TFields["input"], any, TFields["output"]>({
        resolver: zodResolver(schema),
        defaultValues,
        mode: "onSubmit",
    });
    const [state, formAction, isPending] = useActionState(action, initialState);

    useEffect(() => {
        if (state?.errors) {
            for (const [field, message] of Object.entries(state.errors)) {
                form.setError(field as any, { type: "server", message });
            }
        }
    }, [state, form]);

    const onSubmit = form.handleSubmit((_, event) => {
        if (event && event.target) {
            const formData = new FormData(event.target);
            startTransition(() => formAction(formData));
        }
    });

    const errors: EnrichedFieldErrors = enrichErrors(
        Object.fromEntries(
            Object.entries(form.formState.errors).map(([key, err]) => [
                key,
                (err?.message as string) ?? "Invalid value",
            ])
        )
    );

    return {
        control: form.control,
        register: form.register,
        onSubmit,
        errors,
        isSubmitting: isPending,
        state,
    };
}
