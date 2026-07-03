export type GroupDTO = {
    id: string;
    name: string;
    description: string | null;
    photo: string | null;
    contributionAmount: number;
    frequency: string;
    contributionDay: number;
    maxMembers: number;
    memberCount: number;
    payoutOrder: string;
    cycleEndBehavior: string;
    status: "pending" | "active" | "completed";
    inviteCode: string | null;
    createdAt: Date;
};

export type GroupDetailDTO = GroupDTO & {
    currentCycleNumber: number | null;
    cycleStatus: "active" | "completed" | null;
    userSlotPosition: number | null;
    userContributionStatus:
        "pending" | "paid" | "underpaid" | "overpaid" | null;
    isAdmin: boolean;
};
