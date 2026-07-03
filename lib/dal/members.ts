import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { members } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "./helpers/session";
import { assertGroupMember } from "./helpers/guards";
import type { MemberDTO, MemberPreviewDTO } from "@/lib/dto/member.dto";

export const getGroupMembers = cache(
    async (groupId: string): Promise<(MemberDTO | MemberPreviewDTO)[]> => {
        const session = await getSession();
        await assertGroupMember(groupId);

        const results = await db.query.members.findMany({
            where: eq(members.groupId, groupId),
            with: { user: true },
        });

        return results.map((m) => {
            const isSelf = m.userId === session.user.id;

            if (isSelf) {
                return {
                    id: m.id,
                    name: m.user.name,
                    slotPosition: m.slotPosition,
                    accountNumber: m.virtualAccountNumber,
                    contributionStatus: null,
                    joinedAt: m.createdAt,
                } satisfies MemberDTO;
            }

            return {
                id: m.id,
                name: m.user.name,
                slotPosition: m.slotPosition,
                contributionStatus: null,
            } satisfies MemberPreviewDTO;
        });
    }
);

export const getUserMember = cache(
    async (groupId: string): Promise<MemberDTO | null> => {
        const session = await getSession();
        await assertGroupMember(groupId);

        const result = await db.query.members.findFirst({
            where: and(
                eq(members.groupId, groupId),
                eq(members.userId, session.user.id)
            ),
            with: { user: true },
        });

        if (!result) return null;

        return {
            id: result.id,
            name: result.user.name,
            slotPosition: result.slotPosition,
            accountNumber: result.virtualAccountNumber,
            contributionStatus: null,
            joinedAt: result.createdAt,
        };
    }
);

export const getMemberByAccountNumber = async (accountNumber: string) => {
    return db.query.members.findFirst({
        where: eq(members.virtualAccountNumber, accountNumber),
        with: { user: true },
    });
};
