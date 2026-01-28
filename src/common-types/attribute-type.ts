/**
 * Supported attribute/field types for custom table fields.
 * These types define what kind of data can be stored in a custom table field.
 */
export enum AttributeType {
  /** Plain text string */
  STRING = 'string',
  /** Numeric value (integer or decimal) */
  NUMBER = 'number',
  /** Boolean true/false */
  BOOLEAN = 'boolean',
  /** Date/datetime value */
  DATE = 'date',
  /** JSON-encoded string for complex objects */
  JSON_STRING = 'json-string',
}

export type AttributeTypeValue = `${AttributeType}`;

