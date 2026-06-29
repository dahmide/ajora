import type { ZodType, z } from "zod";
import * as zod from "zod";

type ParseResult<T> =
    | { success: true; data: T }
    | { success: false; fieldErrors: Partial<Record<string, string[]>> };

export function parseFormData<TSchema extends ZodType>(
    schema: TSchema,
    formData: FormData
): ParseResult<z.infer<TSchema>> {
    const raw = Object.fromEntries(formData.entries());
    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
        const flattened = zod.flattenError(parsed.error);
        return { success: false, fieldErrors: flattened.fieldErrors };
    }

    return { success: true, data: parsed.data };
}
