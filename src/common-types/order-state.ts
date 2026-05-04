/**
 * State machine protocol types for the command-frame boundary.
 * These mirror @final-commerce/common shapes but carry no logic.
 * command-frame must NOT depend on common.
 */

export interface CFStatePair {
    payment: string;
    fulfillment: string;
}

export type CFBlockedBy = "financial_invariant" | "cross_axis_rule" | "path" | "condition";

export interface CFTransitionResult {
    allowed: boolean;
    blockedBy?: CFBlockedBy;
    guard?: string;
    reason?: string;
    failedConditions?: CFFailedCondition[];
}

export interface CFFailedCondition {
    field: string;
    operator: string;
    value: unknown;
    reason?: string;
}

export interface CFConditionStatus {
    met: boolean;
    description: string;
}

export interface CFAvailableTransition {
    to: CFStatePair;
    displayLabel: string;
    conditions: CFConditionStatus[];
}
