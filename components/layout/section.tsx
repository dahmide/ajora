import { cn } from "@/lib/utils";

export default function Section({
    className,
    ...props
}: React.ComponentProps<"section">) {
    return <section className={cn("py-16 md:py-24", className)} {...props} />;
}
