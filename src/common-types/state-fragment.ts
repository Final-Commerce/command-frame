/**
 * State config fragment types for the command-frame boundary.
 * These mirror @final-commerce/common's StateConfigFragment shapes but carry no logic.
 * command-frame must NOT depend on common.
 *
 * Extensions pass a CFStateConfigFragment to Render, which merges it into the
 * running StoredStateConfig via mergeFragment(). All contributed entries are tagged
 * with the extension's id (_sourceExtensionId) so they can be cleaned up on unregister.
 */

import type { CFStatePair } from "./order-state";

export type CFConditionOperator =
    | "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "in"
    | "notIn"
    | "isEmpty"
    | "isNotEmpty";

export interface CFCondition {
    /** Dot-path into the OrderContext, e.g. "order.balance" or "computed.totalPaid". */
    field: string;
    operator: CFConditionOperator;
    value: unknown;
}

/** All conditions in a group are AND'd together. */
export interface CFConditionGroup {
    conditions: CFCondition[];
}

/** Groups are OR'd — the first passing group satisfies the set. */
export interface CFTransitionConditionSet {
    id: string;
    label: string;
    groups: CFConditionGroup[];
}

export interface CFPaymentTransitionPath {
    from: string;
    to: string;
    /** References a CFTransitionConditionSet.id in the same fragment. */
    conditionSetId?: string;
}

export interface CFFulfillmentTransitionPath {
    from: string;
    to: string;
    conditionSetId?: string;
}

export interface CFCrossAxisRule {
    id: string;
    label: string;
    description?: string;
    enabled: boolean;
    /** Which axis + target state(s) activate this rule. */
    trigger: { axis: "payment" | "fulfillment"; to: string[] };
    /** Which axis + states must be present when the trigger fires. */
    requires: { axis: "payment" | "fulfillment"; states: string[] };
}

export interface CFDisplayStateRule {
    paymentState?: string[];
    fulfillmentState?: string[];
    label: string;
    color?: string;
    icon?: string;
}

/**
 * Partial config contributed by an extension. Render merges this into the
 * running StoredStateConfig. All arrays are appended; display rules replace
 * on key collision.
 *
 * IDs (crossAxisRules, transitionConditions) must be unique across the merged
 * config — prefix them with your extension id to avoid collisions.
 */
export interface CFStateConfigFragment {
    paymentPaths?: CFPaymentTransitionPath[];
    fulfillmentPaths?: CFFulfillmentTransitionPath[];
    crossAxisRules?: CFCrossAxisRule[];
    transitionConditions?: CFTransitionConditionSet[];
    validInitialStates?: CFStatePair[];
    displayStateMap?: CFDisplayStateRule[];
}
