/**
 * State machine protocol types for the command-frame boundary.
 * These mirror @final-commerce/common shapes but carry no logic.
 * command-frame must NOT depend on common.
 */

export interface CFStatePair {
  payment: string;
  fulfillment: string;
}

export type CFBlockedBy = 'financial_invariant' | 'cross_axis_rule' | 'path' | 'condition';

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

/**
 * A merchant-defined order status (per company). Mirrors common's OrderStatusDefinition.
 * `fulfillmentState`: setting the status moves the order there (normal state-machine
 * rules). `requiresPaymentState`: setting it fails unless the order's payment state is
 * one of these — a status never moves money. Neither set = a label-only status.
 */
export interface CFOrderStatusDefinition {
  id: string;
  label: string;
  color?: string;
  icon?: string;
  fulfillmentState?: string;
  requiresPaymentState?: string[];
}
