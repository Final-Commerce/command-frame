import { AttributeType, CFCustomTable, CFCustomTableField } from "../../CommonTypes";

export const MOCK_CUSTOM_TABLES: CFCustomTable[] = [
    {
        _id: "custom_table_1",
        name: "Custom Table 1",
        description: "Custom Table 1 Description",
        metadata: [
            {
                key: "value",
                value: "value"
            }
        ]
    }
];

export const MOCK_CUSTOM_TABLE_FIELDS: CFCustomTableField[] = [
    {
        _id: "field_1",
        tableId: "custom_table_1",
        name: "customerId",
        type: AttributeType.STRING,
        required: true
    },
    {
        _id: "field_2",
        tableId: "custom_table_1",
        name: "points",
        type: AttributeType.NUMBER,
        required: true,
        defaultValue: 0
    },
    {
        _id: "field_3",
        tableId: "custom_table_1",
        name: "isActive",
        type: AttributeType.BOOLEAN,
        required: false,
        defaultValue: true
    },
    {
        _id: "field_4",
        tableId: "custom_table_1",
        name: "lastUpdated",
        type: AttributeType.DATE,
        required: false
    }
];
