"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
    // InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group";

type PasswordInputProps = React.ComponentProps<typeof InputGroupInput>;

export function PasswordInput({ ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        // <InputGroup>
        <>
            <InputGroupInput
                type={showPassword ? "text" : "password"}
                {...props}
            />
            <InputGroupAddon align="inline-end">
                <InputGroupButton
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                        showPassword ? "Hide password" : "Show password"
                    }
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </InputGroupButton>
            </InputGroupAddon>
        </>
        // </InputGroup>
    );
}
