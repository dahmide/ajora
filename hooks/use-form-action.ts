"use client";

import { startTransition, useActionState, useState } from "react";
import { ZodType } from "zod";

type FormErrors = Record<string, string>;
type FormAction<TState> = (
    prevData: TState,
    formData: FormData
) => TState | Promise<TState>;

type UseFormActionOptions<TState> = {
    schema: ZodType;
    initialState: Awaited<TState>;
};

export function useFormAction<TState extends { errors?: FormErrors }>(
    action: FormAction<TState>,
    { schema, initialState }: UseFormActionOptions<TState>
) {
    const [clientErrors, setClientErrors] = useState<FormErrors>({});
    const [state, formAction, submitting] = useActionState<TState, FormData>(
        action,
        initialState
    );

    function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        const values = Object.fromEntries(fd.entries());
        const result = schema.safeParse(values);

        if (!result.success) {
            const errors: FormErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as string;
                // keep the first error per field, ignore subsequent ones for the same field
                if (!errors[key]) errors[key] = issue.message;
            }
            setClientErrors(errors);
            return;
        }

        setClientErrors({});
        startTransition(() => formAction(fd));
    }

    const errors: FormErrors = { ...state.errors, ...clientErrors };
    return { onSubmit, errors, isSubmitting: submitting, state };
}
