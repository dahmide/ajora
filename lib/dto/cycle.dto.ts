export type CycleDTO = {
    id: string;
    cycleNumber: number;
    startDate: Date;
    endDate: Date;
    status: "active" | "completed";
    recipientName: string;
};

export type NextPayoutDTO = {
    groupName: string;
    amount: number;
    estimatedDate: Date;
    cycleNumber: number;
};
