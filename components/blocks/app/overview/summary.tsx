import { ScrollArea } from "@/components/ui/scroll-area";
import { SummaryCard } from "./summary-card";

export default function Summary() {
    return (
        <div>
            <ScrollArea className="whitespace-nowrap">
                <div className="px-1 py-6 overflow-visible grid grid-cols-[repeat(4,250px)] gap-6 md:grid-cols-4">
                    <SummaryCard
                        title="Total Members"
                        value="1,248"
                        description="+12% from last month" 
                        className="flex-1"
                    />
                    <SummaryCard
                        title="Active Groups"
                        value="18"
                        description="+2 this week"
                    />
                    <SummaryCard
                        title="Events"
                        value="32"
                        description="5 upcoming this week"
                    />
                    <SummaryCard
                        title="Attendance Rate"
                        value="94%"
                        description="+3% from last month"
                    />
                </div>
            </ScrollArea>
        </div>
    );
}
