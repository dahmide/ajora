import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { groups } from "./groups";
import { relations } from "drizzle-orm";
import { contributions } from "./contributions"

export const members = pgTable("members", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    groupId: text("group_id")
        .notNull()
        .references(() => groups.id),
    virtualAccountNumber: text("virtual_account_number").notNull(),
    virtualAccountRef: text("virtual_account_ref").notNull(),
    slotPosition: integer("slot_position").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const membersRelations = relations(members, ({ one, many }) => ({
    user: one(user, {
        fields: [members.userId],
        references: [user.id],
    }),
    group: one(groups, {
        fields: [members.groupId],
        references: [groups.id],
    }),
    contributions: many(contributions),
}));