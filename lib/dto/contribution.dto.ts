export type ContributionDTO = {
    id: string;
    cycleNumber: number;
    amountDue: number;
    amountPaid: number;
    status: "pending" | "paid" | "underpaid" | "overpaid";
    creditCarryover: number;
    paidAt: Date | null;
    createdAt: Date;
};

export type ContributionRowDTO = {
    id: string;
    memberName: string;
    groupName: string;
    cycleNumber: number;
    amount: number | null;
    amountMasked: boolean;
    status: "pending" | "paid" | "underpaid" | "overpaid";
    createdAt: Date;
};
