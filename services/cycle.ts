import { db } from "@/lib/db";
import { cycles, contributions, members, groups } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createFirstCycle(groupId: string) {
    const group = await db.query.groups.findFirst({
        where: eq(groups.id, groupId),
        with: { members: true },
    });

    if (!group) throw new Error("Group not found");

    // Assign slot positions based on payoutOrder
    let orderedMembers = [...group.members];

    if (group.payoutOrder === "random") {
        orderedMembers = orderedMembers.sort(() => Math.random() - 0.5);
        // Update slot positions in DB
        await Promise.all(
            orderedMembers.map((m, i) =>
                db
                    .update(members)
                    .set({ slotPosition: i + 1 })
                    .where(eq(members.id, m.id))
            )
        );
    }
    // "join_order" — slot positions already set as members joined
    // "creator" — slot positions already manually set by admin

    const recipient = orderedMembers.find((m) => m.slotPosition === 1);
    if (!recipient) throw new Error("No recipient found");

    const startDate = new Date();
    const endDate = calculateCycleEndDate(
        startDate,
        group.frequency,
        group.contributionDay
    );

    const cycleId = crypto.randomUUID();

    await db.insert(cycles).values({
        id: cycleId,
        groupId,
        cycleNumber: 1,
        startDate,
        endDate,
        recipientId: recipient.id,
        status: "active",
    });

    await createContributionsForCycle(
        cycleId,
        group.members,
        group.contributionAmount
    );
}

export async function createContributionsForCycle(
    cycleId: string,
    groupMembers: { id: string }[],
    amountDue: number
) {
    await Promise.all(
        groupMembers.map((m) =>
            db.insert(contributions).values({
                id: crypto.randomUUID(),
                memberId: m.id,
                cycleId,
                amountDue,
                amountPaid: 0,
                status: "pending",
                creditCarryover: 0,
            })
        )
    );
}

export async function completeCycle(cycleId: string) {
    const cycle = await db.query.cycles.findFirst({
        where: eq(cycles.id, cycleId),
        with: {
            group: true,
            recipient: { with: { user: true } },
        },
    });

    if (!cycle) throw new Error("Cycle not found");

    await db
        .update(cycles)
        .set({ status: "completed" })
        .where(eq(cycles.id, cycleId));

    // Payout notification email fired from reconcile.ts after this

    switch (cycle.group.cycleEndBehavior) {
        case "auto_restart":
            await startNextCycle(cycle.groupId, cycle.cycleNumber);
            break;
        case "ask_admin":
            // send email to admin asking to start next round
            // await sendStartNextCycleEmail(admin, cycle.group)
            break;
        case "end":
            await db
                .update(groups)
                .set({ status: "completed" })
                .where(eq(groups.id, cycle.groupId));
            break;
    }
}

export async function startNextCycle(groupId: string, lastCycleNumber: number) {
    const group = await db.query.groups.findFirst({
        where: eq(groups.id, groupId),
        with: { members: true },
    });

    if (!group) throw new Error("Group not found");

    const nextCycleNumber = lastCycleNumber + 1;
    const nextRecipient = group.members.find(
        (m) => m.slotPosition === nextCycleNumber
    );

    if (!nextRecipient) {
        // All slots done — complete the group
        await db
            .update(groups)
            .set({ status: "completed" })
            .where(eq(groups.id, groupId));
        return;
    }

    const startDate = new Date();
    const endDate = calculateCycleEndDate(
        startDate,
        group.frequency,
        group.contributionDay
    );

    const cycleId = crypto.randomUUID();

    await db.insert(cycles).values({
        id: cycleId,
        groupId,
        cycleNumber: nextCycleNumber,
        startDate,
        endDate,
        recipientId: nextRecipient.id,
        status: "active",
    });

    await createContributionsForCycle(
        cycleId,
        group.members,
        group.contributionAmount
    );
}

function calculateCycleEndDate(
    startDate: Date,
    frequency: string,
    contributionDay: number
): Date {
    const date = new Date(startDate);
    switch (frequency) {
        case "weekly":
            date.setDate(date.getDate() + 7);
            break;
        case "monthly":
            date.setMonth(date.getMonth() + 1);
            date.setDate(contributionDay);
            break;
    }
    return date;
}
