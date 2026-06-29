import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const groups = pgTable("groups", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    contributionAmount: real("contribution_amount").notNull(),
    frequency: text("frequency").notNull(),
    startDate: timestamp("start_date").notNull(),
    createdBy: text("created_by")
        .notNull()
        .references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
