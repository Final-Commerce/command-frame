import { BaseEntity } from "./base-entity";

export type CFCustomTable = BaseEntity & {
    name: string;
    description?: string;
    metadata?: Array<{
        key: string;
        value: any;
    }>;
}

export enum AttributeType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    DATE = 'date',
    JSON_STRING = 'json-string',
  }

export type CFCustomTableField = BaseEntity & {
    tableId: string;
    name: string;
    type: AttributeType;
    required?: boolean;
    defaultValue?: any;
    referenceLinkedCollection?: string;
    referenceLinkedField?: string;
}
