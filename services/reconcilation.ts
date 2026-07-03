import { db } from "@/lib/db";
import { contributions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getMemberByAccountNumber } from "@/lib/dal/members";
import { completeCycle } from "./cycle";
import {
    sendPaymentConfirmedEmail,
    sendPaymentShortEmail,
    sendPaymentCreditedEmail,
    sendCycleCompleteEmail,
    sendPaymentReversalEmail,
} from "@/lib/email";

export async function reconcilePayment(payload: {
    accountNumber: string;
    amount: number;
    transactionRef: string;
}) {
    // 1. Idempotency check
    const existing = await db.query.contributions.findFirst({
        where: eq(contributions.transactionRef, payload.transactionRef),
    });
    if (existing) return;

    // 2. Find member
    const member = await getMemberByAccountNumber(payload.accountNumber);
    if (!member) return;

    // 3. Find active cycle
    const activeCycle = await db.query.cycles.findFirst({
        where: and(
            eq(cycles.groupId, member.groupId),
            eq(cycles.status, "active")
        ),
    });
    if (!activeCycle) return;

    // 4. Get or create contribution record
    let contribution = await db.query.contributions.findFirst({
        where: and(
            eq(contributions.memberId, member.id),
            eq(contributions.cycleId, activeCycle.id)
        ),
    });

    if (!contribution) return;

    // 5. Apply credit carryover + new payment
    const effectiveAmountPaid =
        contribution.amountPaid +
        payload.amount +
        (contribution.creditCarryover ?? 0);
    const delta = effectiveAmountPaid - contribution.amountDue;

    // 6. Determine status + update DB + send email
    if (delta === 0) {
        await db
            .update(contributions)
            .set({
                amountPaid: effectiveAmountPaid,
                status: "paid",
                transactionRef: payload.transactionRef,
                paidAt: new Date(),
                creditCarryover: 0,
            })
            .where(eq(contributions.id, contribution.id));

        await sendPaymentConfirmedEmail(
            member,
            activeCycle,
            effectiveAmountPaid
        );
    } else if (delta < 0) {
        await db
            .update(contributions)
            .set({
                amountPaid: effectiveAmountPaid,
                status: "underpaid",
                transactionRef: payload.transactionRef,
            })
            .where(eq(contributions.id, contribution.id));

        await sendPaymentShortEmail(member, activeCycle, Math.abs(delta));
    } else {
        await db
            .update(contributions)
            .set({
                amountPaid: contribution.amountDue,
                status: "overpaid",
                transactionRef: payload.transactionRef,
                paidAt: new Date(),
                creditCarryover: delta,
            })
            .where(eq(contributions.id, contribution.id));

        await sendPaymentCreditedEmail(member, activeCycle, delta);
    }

    // 7. Check if all members paid — complete the cycle
    const unpaid = await db.query.contributions.findMany({
        where: and(
            eq(contributions.cycleId, activeCycle.id),
            eq(contributions.status, "pending")
        ),
        columns: { id: true },
    });

    if (unpaid.length === 0) {
        await completeCycle(activeCycle.id);
        await sendCycleCompleteEmail(member, activeCycle);
    }
}

export async function handleReversal(payload: { transactionRef: string }) {
    const contribution = await db.query.contributions.findFirst({
        where: eq(contributions.transactionRef, payload.transactionRef),
        with: { member: { with: { user: true } }, cycle: true },
    });

    if (!contribution) return;

    await db
        .update(contributions)
        .set({
            amountPaid: 0,
            status: "pending",
            transactionRef: null,
            paidAt: null,
            creditCarryover: 0,
        })
        .where(eq(contributions.id, contribution.id));

    await sendPaymentReversalEmail(contribution.member, contribution.cycle);
}
