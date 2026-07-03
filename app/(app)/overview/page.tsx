import { Button } from "@/components/ui/button";
import {
    Summary,
    RecentActivities,
    ActiveGroups,
} from "@/components/blocks/app/overview";

export default function Overview() {
    return (
        <div className="grid gap-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-2">
                    <h1>Good morning, John</h1>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Provident, dolor!
                    </p>
                </div>
                <div className="flex flex-row gap-2">
                    <Button variant="default">Create a group</Button>
                    <Button variant="outline">Create a group</Button>
                </div>
            </div>
            <Summary />
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ActiveGroups />
                </div>
                <div className="lg:col-span-1">
                    <RecentActivities />
                </div>
            </div>
        </div>
    );
}
