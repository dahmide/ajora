import { pgTable, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { members } from "./members";
import { cycles } from "./cycles";
import { relations } from "drizzle-orm";

export const groups = pgTable("groups", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    photo: text("photo"),
    contributionAmount: real("contribution_amount").notNull(),
    frequency: text("frequency").notNull(),
    contributionDay: integer("contribution_day").notNull(),
    maxMembers: integer("max_members").notNull(),
    payoutOrder: text("payout_order").notNull(),
    payoutReleaseRule: text("payout_release_rule")
        .notNull()
        .default("all_contributed"),
    cycleEndBehavior: text("cycle_end_behavior").notNull().default("ask_admin"),
    status: text("status").notNull().default("pending"),
    inviteCode: text("invite_code").unique(),
    createdBy: text("created_by")
        .notNull()
        .references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groupsRelations = relations(groups, ({ one, many }) => ({
    creator: one(user, {
        fields: [groups.createdBy],
        references: [user.id],
    }),
    members: many(members),
    cycles: many(cycles),
}));
