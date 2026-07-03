import { db } from "@/lib/db";
import { groups, members } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/dal/helpers/session";
import { nanoid } from "nanoid";

export async function createGroup(input: {
    name: string;
    description?: string;
    photo?: string;
    contributionAmount: number;
    frequency: string;
    contributionDay: number;
    maxMembers: number;
    payoutOrder: string;
    cycleEndBehavior: string;
}) {
    const session = await getSession();

    const id = crypto.randomUUID();
    const inviteCode = nanoid(10);

    await db.insert(groups).values({
        id,
        ...input,
        payoutReleaseRule: "all_contributed",
        status: "pending",
        inviteCode,
        createdBy: session.user.id,
    });

    // creator automatically becomes the first member
    await db.insert(members).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        groupId: id,
        virtualAccountNumber: "", // provisioned by Nomba later
        virtualAccountRef: "",
        slotPosition: 1,
    });

    return { id, inviteCode };
}

export async function startGroup(groupId: string) {
    const group = await db.query.groups.findFirst({
        where: eq(groups.id, groupId),
        with: { members: { columns: { id: true } } },
    });

    if (!group) throw new Error("Group not found");
    if (group.status !== "pending") throw new Error("Group already started");
    if (group.members.length < group.maxMembers) {
        throw new Error("Group is not full yet");
    }

    await db
        .update(groups)
        .set({ status: "active" })
        .where(eq(groups.id, groupId));
}

export async function generateNewInviteCode(groupId: string) {
    const inviteCode = nanoid(10);
    await db.update(groups).set({ inviteCode }).where(eq(groups.id, groupId));
    return inviteCode;
}
