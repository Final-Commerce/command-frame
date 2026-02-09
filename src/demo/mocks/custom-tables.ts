import { AttributeType, CFCustomTable, CFCustomTableField } from "../../CommonTypes";
import { CustomExtension } from "../../common-types/custom-extensions";

export const MOCK_CUSTOM_TABLES: CFCustomTable[] = [
    {
        _id: "custom_table_users",
        name: "users",
        description: "Store user information with fullName, email, and active status",
        metadata: [
            {
                key: "extensionId",
                value: "ext_loyalty_program"
            },
            {
                key: "version",
                value: "1.0"
            }
        ],
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z"
    },
    {
        _id: "custom_table_preferences",
        name: "customer_preferences",
        description: "Store customer preferences and settings",
        metadata: [
            {
                key: "category",
                value: "customer_data"
            }
        ],
        createdAt: "2024-01-02T08:00:00.000Z",
        updatedAt: "2024-01-02T08:00:00.000Z"
    },
    {
        _id: "custom_table_loyalty",
        name: "loyalty_points",
        description: "Track customer loyalty points",
        metadata: [
            {
                key: "extensionId",
                value: "ext_loyalty_program"
            }
        ],
        createdAt: "2024-01-03T09:00:00.000Z",
        updatedAt: "2024-01-03T09:00:00.000Z"
    }
];

export const MOCK_CUSTOM_TABLE_FIELDS: CFCustomTableField[] = [
    // Fields for 'users' table
    {
        _id: "field_users_fullname",
        tableId: "custom_table_users",
        name: "fullName",
        type: AttributeType.STRING,
        required: true,
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z"
    },
    {
        _id: "field_users_email",
        tableId: "custom_table_users",
        name: "email",
        type: AttributeType.STRING,
        required: true,
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z"
    },
    {
        _id: "field_users_isactive",
        tableId: "custom_table_users",
        name: "isActive",
        type: AttributeType.BOOLEAN,
        required: true,
        defaultValue: true,
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z"
    },
    // Fields for 'customer_preferences' table
    {
        _id: "field_prefs_fullname",
        tableId: "custom_table_preferences",
        name: "fullName",
        type: AttributeType.STRING,
        required: true,
        createdAt: "2024-01-02T08:00:00.000Z",
        updatedAt: "2024-01-02T08:00:00.000Z"
    },
    {
        _id: "field_prefs_email",
        tableId: "custom_table_preferences",
        name: "email",
        type: AttributeType.STRING,
        required: true,
        createdAt: "2024-01-02T08:00:00.000Z",
        updatedAt: "2024-01-02T08:00:00.000Z"
    },
    {
        _id: "field_prefs_isactive",
        tableId: "custom_table_preferences",
        name: "isActive",
        type: AttributeType.BOOLEAN,
        required: false,
        defaultValue: true,
        createdAt: "2024-01-02T08:00:00.000Z",
        updatedAt: "2024-01-02T08:00:00.000Z"
    },
    // Fields for 'loyalty_points' table
    {
        _id: "field_loyalty_fullname",
        tableId: "custom_table_loyalty",
        name: "fullName",
        type: AttributeType.STRING,
        required: true,
        createdAt: "2024-01-03T09:00:00.000Z",
        updatedAt: "2024-01-03T09:00:00.000Z"
    },
    {
        _id: "field_loyalty_email",
        tableId: "custom_table_loyalty",
        name: "email",
        type: AttributeType.STRING,
        required: true,
        createdAt: "2024-01-03T09:00:00.000Z",
        updatedAt: "2024-01-03T09:00:00.000Z"
    },
    {
        _id: "field_loyalty_isactive",
        tableId: "custom_table_loyalty",
        name: "isActive",
        type: AttributeType.BOOLEAN,
        required: false,
        defaultValue: true,
        createdAt: "2024-01-03T09:00:00.000Z",
        updatedAt: "2024-01-03T09:00:00.000Z"
    }
];

// Mock data for custom tables (using the schema: fullName, email, isActive)
export interface CustomTableDataRow {
    _id: string;
    fullName: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const MOCK_CUSTOM_TABLE_DATA: Record<string, CustomTableDataRow[]> = {
    users: [
        {
            _id: "user_data_1",
            fullName: "John Doe",
            email: "john.doe@example.com",
            isActive: true,
            createdAt: "2024-01-10T10:00:00.000Z",
            updatedAt: "2024-01-10T10:00:00.000Z"
        },
        {
            _id: "user_data_2",
            fullName: "Jane Smith",
            email: "jane.smith@example.com",
            isActive: true,
            createdAt: "2024-01-11T11:00:00.000Z",
            updatedAt: "2024-01-11T11:00:00.000Z"
        },
        {
            _id: "user_data_3",
            fullName: "Bob Johnson",
            email: "bob.johnson@example.com",
            isActive: false,
            createdAt: "2024-01-12T09:00:00.000Z",
            updatedAt: "2024-01-15T14:30:00.000Z"
        },
        {
            _id: "user_data_4",
            fullName: "Alice Williams",
            email: "alice.williams@example.com",
            isActive: true,
            createdAt: "2024-01-13T08:00:00.000Z",
            updatedAt: "2024-01-13T08:00:00.000Z"
        },
        {
            _id: "user_data_5",
            fullName: "Charlie Brown",
            email: "charlie.brown@example.com",
            isActive: false,
            createdAt: "2024-01-14T12:00:00.000Z",
            updatedAt: "2024-01-16T16:00:00.000Z"
        }
    ],
    customer_preferences: [
        {
            _id: "pref_data_1",
            fullName: "Giuseppe Verdi",
            email: "giuseppe@example.com",
            isActive: true,
            createdAt: "2024-01-10T14:00:00.000Z",
            updatedAt: "2024-01-10T14:00:00.000Z"
        },
        {
            _id: "pref_data_2",
            fullName: "Sofia Loren",
            email: "sofia@example.com",
            isActive: true,
            createdAt: "2024-01-11T15:00:00.000Z",
            updatedAt: "2024-01-11T15:00:00.000Z"
        },
        {
            _id: "pref_data_3",
            fullName: "Alessandro Volta",
            email: "alessandro@example.com",
            isActive: false,
            createdAt: "2024-01-12T16:00:00.000Z",
            updatedAt: "2024-01-12T16:00:00.000Z"
        }
    ],
    loyalty_points: [
        {
            _id: "loyalty_data_1",
            fullName: "Isabella Rossellini",
            email: "isabella@example.com",
            isActive: true,
            createdAt: "2024-01-10T10:30:00.000Z",
            updatedAt: "2024-01-10T10:30:00.000Z"
        },
        {
            _id: "loyalty_data_2",
            fullName: "Leonardo Da Vinci",
            email: "leonardo@example.com",
            isActive: true,
            createdAt: "2024-01-11T11:30:00.000Z",
            updatedAt: "2024-01-11T11:30:00.000Z"
        }
    ]
};

export const MOCK_CUSTOM_EXTENSIONS: CustomExtension[] = [
    {
        _id: "ext_loyalty_program",
        label: "Loyalty Program Extension",
        description: "Add a loyalty points system to your POS",
        category: "Customer Management",
        short_description: "Loyalty points tracking",
        long_description: "A comprehensive loyalty program that allows you to track customer points, offer rewards, and increase customer retention.",
        main_image: "https://example.com/images/loyalty-extension.png",
        backgroundUrl: "https://example.com/images/loyalty-bg.jpg",
        gallery: [
            "https://example.com/images/loyalty-1.png",
            "https://example.com/images/loyalty-2.png"
        ],
        price: "$29.99",
        website: "https://loyalty-extension.example.com",
        isDeleted: false,
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-10T14:30:00.000Z",
        __v: 0
    },
    {
        _id: "ext_inventory_analytics",
        label: "Inventory Analytics",
        description: "Advanced inventory tracking and reporting",
        category: "Analytics",
        short_description: "Real-time inventory insights",
        long_description: "Get detailed insights into your inventory with real-time tracking, low stock alerts, and comprehensive reporting.",
        main_image: "https://example.com/images/inventory-extension.png",
        price: "$49.99",
        isDeleted: false,
        createdAt: "2024-01-05T08:00:00.000Z",
        updatedAt: "2024-01-05T08:00:00.000Z",
        __v: 0
    },
    {
        _id: "ext_email_marketing",
        label: "Email Marketing Suite",
        description: "Email campaigns and customer engagement",
        category: "Marketing",
        short_description: "Automated email marketing",
        long_description: "Create and manage email campaigns, automate customer communications, and track engagement metrics.",
        main_image: "https://example.com/images/email-extension.png",
        price: "$39.99",
        isDeleted: false,
        createdAt: "2024-01-08T12:00:00.000Z",
        updatedAt: "2024-01-08T12:00:00.000Z",
        __v: 0
    }
];
