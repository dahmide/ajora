import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SummaryCard({
    title,
    value,
    description,
    className,
}: {
    title: string;
    value: string | number;
    description: string;
    className?: string;
}) {
    return (
        <Card className={cn("shrink-0", className)}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p>{description}</p>
            </CardContent>
        </Card>
    );
}
