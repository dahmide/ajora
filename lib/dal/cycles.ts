import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { cycles, members } from "@/db/schema";
import { eq, and, inArray, asc } from "drizzle-orm";
import { getSession } from "./helpers/session";
import { assertGroupMember } from "./helpers/guards";
import type { CycleDTO, NextPayoutDTO } from "@/lib/dto/cycle.dto";

export const getActiveCycle = cache(
    async (groupId: string): Promise<CycleDTO | null> => {
        await assertGroupMember(groupId);

        const result = await db.query.cycles.findFirst({
            where: and(
                eq(cycles.groupId, groupId),
                eq(cycles.status, "active")
            ),
            with: {
                recipient: { with: { user: true } },
            },
        });

        if (!result) return null;

        return {
            id: result.id,
            cycleNumber: result.cycleNumber,
            startDate: result.startDate,
            endDate: result.endDate,
            status: result.status as CycleDTO["status"],
            recipientName: result.recipient.user.name,
        };
    }
);

export const getCycles = cache(async (groupId: string): Promise<CycleDTO[]> => {
    await assertGroupMember(groupId);

    const results = await db.query.cycles.findMany({
        where: eq(cycles.groupId, groupId),
        with: {
            recipient: { with: { user: true } },
        },
        orderBy: [asc(cycles.cycleNumber)],
    });

    return results.map((c) => ({
        id: c.id,
        cycleNumber: c.cycleNumber,
        startDate: c.startDate,
        endDate: c.endDate,
        status: c.status as CycleDTO["status"],
        recipientName: c.recipient.user.name,
    }));
});

export const getNextPayoutCycle = cache(
    async (): Promise<NextPayoutDTO | null> => {
        const session = await getSession();

        const userMembers = await db.query.members.findMany({
            where: eq(members.userId, session.user.id),
            with: {
                group: {
                    with: {
                        members: { columns: { id: true } },
                    },
                },
            },
        });

        if (userMembers.length === 0) return null;

        const results = await Promise.all(
            userMembers.map(async (m) => {
                const activeCycle = await db.query.cycles.findFirst({
                    where: and(
                        eq(cycles.groupId, m.groupId),
                        eq(cycles.status, "active")
                    ),
                });

                if (!activeCycle) return null;

                const slotsAhead = m.slotPosition - activeCycle.cycleNumber;
                if (slotsAhead <= 0) return null;

                const estimatedDate = calculatePayoutDate(
                    activeCycle.startDate,
                    m.group.frequency,
                    slotsAhead
                );

                return {
                    groupName: m.group.name,
                    amount: m.group.contributionAmount * m.group.members.length,
                    estimatedDate,
                    cycleNumber: m.slotPosition,
                } satisfies NextPayoutDTO;
            })
        );

        const valid = results.filter(Boolean) as NextPayoutDTO[];
        if (valid.length === 0) return null;

        return valid.sort(
            (a, b) => a.estimatedDate.getTime() - b.estimatedDate.getTime()
        )[0];
    }
);

function calculatePayoutDate(
    startDate: Date,
    frequency: string,
    slotsAhead: number
): Date {
    const date = new Date(startDate);
    switch (frequency) {
        case "weekly":
            date.setDate(date.getDate() + slotsAhead * 7);
            break;
        case "monthly":
            date.setMonth(date.getMonth() + slotsAhead);
            break;
        default:
            date.setMonth(date.getMonth() + slotsAhead);
    }
    return date;
}
