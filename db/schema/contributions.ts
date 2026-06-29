import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";
import { members } from "./members";
import { cycles } from "./cycles";

export const contributions = pgTable("contributions", {
    id: text("id").primaryKey(),
    memberId: text("member_id")
        .notNull()
        .references(() => members.id),
    cycleId: text("cycle_id")
        .notNull()
        .references(() => cycles.id),
    amountDue: real("amount_due").notNull(),
    amountPaid: real("amount_paid").notNull().default(0),
    status: text("status").notNull().default("pending"),
    transactionRef: text("transaction_ref"),
    creditCarryover: real("credit_carryover").notNull().default(0),
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
