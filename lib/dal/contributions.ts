import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { contributions, groups, members } from "@/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";
import { getSession } from "./helpers/session";
import { assertGroupMember } from "./helpers/guards";
import type {
    ContributionDTO,
    ContributionRowDTO,
} from "@/lib/dto/contribution.dto";

export const getMemberContributions = cache(
    async (groupId: string): Promise<ContributionDTO[]> => {
        const session = await getSession();
        await assertGroupMember(groupId);

        const member = await db.query.members.findFirst({
            where: and(
                eq(members.groupId, groupId),
                eq(members.userId, session.user.id)
            ),
            columns: { id: true },
        });

        if (!member) return [];

        const results = await db.query.contributions.findMany({
            where: eq(contributions.memberId, member.id),
            with: { cycle: true },
            orderBy: [desc(contributions.createdAt)],
        });

        return results.map((c) => ({
            id: c.id,
            cycleNumber: c.cycle.cycleNumber,
            amountDue: c.amountDue,
            amountPaid: c.amountPaid,
            status: c.status as ContributionDTO["status"],
            creditCarryover: c.creditCarryover,
            paidAt: c.paidAt,
            createdAt: c.createdAt,
        }));
    }
);

export const getGroupContributions = cache(
    async (groupId: string): Promise<ContributionRowDTO[]> => {
        const session = await getSession();
        await assertGroupMember(groupId);

        const isAdmin = await db.query.groups.findFirst({
            where: and(
                eq(groups.id, groupId),
                eq(groups.createdBy, session.user.id)
            ),
            columns: { id: true },
        });

        const groupMembers = await db.query.members.findMany({
            where: eq(members.groupId, groupId),
            columns: { id: true, userId: true },
            with: { user: { columns: { name: true } } },
        });

        const memberIds = groupMembers.map((m) => m.id);

        const results = await db.query.contributions.findMany({
            where: inArray(contributions.memberId, memberIds),
            with: { cycle: true, member: { with: { user: true } } },
            orderBy: [desc(contributions.createdAt)],
        });

        return results.map((c) => {
            const isSelf = c.member.userId === session.user.id;
            const canSeeAmount = isSelf || !!isAdmin;

            return {
                id: c.id,
                memberName: c.member.user.name,
                groupName: "",
                cycleNumber: c.cycle.cycleNumber,
                amount: canSeeAmount ? c.amountPaid : null,
                amountMasked: !canSeeAmount,
                status: c.status as ContributionRowDTO["status"],
                createdAt: c.createdAt,
            };
        });
    }
);

export const getUserContributions = cache(
    async (): Promise<ContributionDTO[]> => {
        const session = await getSession();

        const userMembers = await db.query.members.findMany({
            where: eq(members.userId, session.user.id),
            columns: { id: true },
        });

        const memberIds = userMembers.map((m) => m.id);
        if (memberIds.length === 0) return [];

        const results = await db.query.contributions.findMany({
            where: inArray(contributions.memberId, memberIds),
            with: { cycle: true },
            orderBy: [desc(contributions.createdAt)],
        });

        return results.map((c) => ({
            id: c.id,
            cycleNumber: c.cycle.cycleNumber,
            amountDue: c.amountDue,
            amountPaid: c.amountPaid,
            status: c.status as ContributionDTO["status"],
            creditCarryover: c.creditCarryover,
            paidAt: c.paidAt,
            createdAt: c.createdAt,
        }));
    }
);

export const getRecentContributions = cache(
    async (limit = 10): Promise<ContributionRowDTO[]> => {
        const session = await getSession();

        const userMembers = await db.query.members.findMany({
            where: eq(members.userId, session.user.id),
            columns: { id: true },
            with: { group: { columns: { name: true } } },
        });

        const memberIds = userMembers.map((m) => m.id);
        if (memberIds.length === 0) return [];

        const results = await db.query.contributions.findMany({
            where: inArray(contributions.memberId, memberIds),
            with: {
                member: { with: { user: true, group: true } },
                cycle: true,
            },
            orderBy: [desc(contributions.createdAt)],
            limit,
        });

        return results.map((c) => ({
            id: c.id,
            memberName: c.member.user.name,
            groupName: c.member.group.name,
            cycleNumber: c.cycle.cycleNumber,
            amount: c.amountPaid,
            amountMasked: false,
            status: c.status as ContributionRowDTO["status"],
            createdAt: c.createdAt,
        }));
    }
);
