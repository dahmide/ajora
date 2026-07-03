import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { groups, members, cycles } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { getSession } from "./helpers/session";
import { assertGroupMember } from "./helpers/guards";
import type { GroupDTO, GroupDetailDTO } from "@/lib/dto/group.dto";

export const getUserGroups = cache(async (): Promise<GroupDTO[]> => {
    const session = await getSession();

    const results = await db.query.members.findMany({
        where: eq(members.userId, session.user.id),
        with: {
            group: {
                with: {
                    members: { columns: { id: true } },
                },
            },
        },
    });

    return results.map((m) => ({
        id: m.group.id,
        name: m.group.name,
        description: m.group.description,
        photo: m.group.photo,
        contributionAmount: m.group.contributionAmount,
        frequency: m.group.frequency,
        contributionDay: m.group.contributionDay,
        maxMembers: m.group.maxMembers,
        memberCount: m.group.members.length,
        payoutOrder: m.group.payoutOrder,
        cycleEndBehavior: m.group.cycleEndBehavior,
        status: m.group.status as GroupDTO["status"],
        inviteCode: m.group.inviteCode,
        createdAt: m.group.createdAt,
    }));
});

export const getGroup = cache(
    async (groupId: string): Promise<GroupDetailDTO | null> => {
        const session = await getSession();
        await assertGroupMember(groupId);

        const result = await db.query.groups.findFirst({
            where: eq(groups.id, groupId),
            with: {
                members: {
                    columns: { id: true, userId: true, slotPosition: true },
                },
                cycles: {
                    where: eq(cycles.status, "active"),
                    columns: { id: true, cycleNumber: true, status: true },
                },
            },
        });

        if (!result) return null;

        const userMember = result.members.find(
            (m) => m.userId === session.user.id
        );
        const activeCycle = result.cycles[0] ?? null;

        return {
            id: result.id,
            name: result.name,
            description: result.description,
            photo: result.photo,
            contributionAmount: result.contributionAmount,
            frequency: result.frequency,
            contributionDay: result.contributionDay,
            maxMembers: result.maxMembers,
            memberCount: result.members.length,
            payoutOrder: result.payoutOrder,
            cycleEndBehavior: result.cycleEndBehavior,
            status: result.status as GroupDTO["status"],
            inviteCode: result.inviteCode,
            createdAt: result.createdAt,
            currentCycleNumber: activeCycle?.cycleNumber ?? null,
            cycleStatus:
                (activeCycle?.status as GroupDetailDTO["cycleStatus"]) ?? null,
            userSlotPosition: userMember?.slotPosition ?? null,
            userContributionStatus: null,
            isAdmin: result.createdBy === session.user.id,
        };
    }
);

export const getGroupByInviteCode = cache(
    async (inviteCode: string): Promise<GroupDTO | null> => {
        const result = await db.query.groups.findFirst({
            where: eq(groups.inviteCode, inviteCode),
            with: {
                members: { columns: { id: true } },
            },
        });

        if (!result) return null;

        return {
            id: result.id,
            name: result.name,
            description: result.description,
            photo: result.photo,
            contributionAmount: result.contributionAmount,
            frequency: result.frequency,
            contributionDay: result.contributionDay,
            maxMembers: result.maxMembers,
            memberCount: result.members.length,
            payoutOrder: result.payoutOrder,
            cycleEndBehavior: result.cycleEndBehavior,
            status: result.status as GroupDTO["status"],
            inviteCode: result.inviteCode,
            createdAt: result.createdAt,
        };
    }
);
