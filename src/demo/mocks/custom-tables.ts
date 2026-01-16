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
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export const MOCK_CUSTOM_TABLE_FIELDS: CFCustomTableField[] = [
    {
        _id: "field_1",
        tableId: "custom_table_1",
        name: "customerId",
        type: AttributeType.STRING,
        required: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "field_2",
        tableId: "custom_table_1",
        name: "points",
        type: AttributeType.NUMBER,
        required: true,
        defaultValue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "field_3",
        tableId: "custom_table_1",
        name: "isActive",
        type: AttributeType.BOOLEAN,
        required: false,
        defaultValue: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: "field_4",
        tableId: "custom_table_1",
        name: "lastUpdated",
        type: AttributeType.DATE,
        required: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
