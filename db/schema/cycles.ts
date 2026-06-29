import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { groups } from "./groups";
import { members } from "./members";

export const cycles = pgTable("cycles", {
    id: text("id").primaryKey(),
    groupId: text("group_id")
        .notNull()
        .references(() => groups.id),
    cycleNumber: integer("cycle_number").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    recipientId: text("recipient_id")
        .notNull()
        .references(() => members.id),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
