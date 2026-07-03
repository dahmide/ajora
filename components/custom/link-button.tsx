import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LinkButton({
    href,
    className,
    children,
}: React.ComponentProps<typeof Button> & {
    href: string;
    className?: string;
}) {
    return (
        <Button
            className={cn(className)}
            nativeButton={false}
            render={<Link href={href}>{children}</Link>}
        />
    );
}
