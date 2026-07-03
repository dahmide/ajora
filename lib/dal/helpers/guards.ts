import "server-only";
import { db } from "@/lib/db";
import { members, groups } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getSession } from "./session";

export async function assertGroupMember(groupId: string) {
    const session = await getSession();

    const membership = await db.query.members.findFirst({
        where: and(
            eq(members.groupId, groupId),
            eq(members.userId, session.user.id)
        ),
        columns: { id: true },
    });

    if (!membership) throw new Error("Unauthorized");
    return membership;
}

export async function assertGroupAdmin(groupId: string) {
    const session = await getSession();

    const group = await db.query.groups.findFirst({
        where: and(
            eq(groups.id, groupId),
            eq(groups.createdBy, session.user.id)
        ),
        columns: { id: true },
    });

    if (!group) throw new Error("Unauthorized — admin only");
    return group;
}
