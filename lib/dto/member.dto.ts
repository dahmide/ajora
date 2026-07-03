export type MemberDTO = {
    id: string;
    name: string;
    slotPosition: number;
    accountNumber: string;
    contributionStatus: "pending" | "paid" | "underpaid" | "overpaid" | null;
    joinedAt: Date;
};

export type MemberPreviewDTO = {
    id: string;
    name: string;
    slotPosition: number;
    contributionStatus: "pending" | "paid" | "underpaid" | "overpaid" | null;
};
