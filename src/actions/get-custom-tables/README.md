# getCustomTables

Retrieves all custom tables associated with the current company. Custom tables allow merchants to store arbitrary structured data for their business needs.

## Parameters

None.

## Response

`Promise<GetCustomTablesResponse>`

| Field          | Type              | Description                                        |
| :------------- | :---------------- | :------------------------------------------------- |
| `success`      | `boolean`         | `true` if custom tables were retrieved successfully. |
| `customTables` | `CFCustomTable[]` | Array of custom table objects.                     |
| `timestamp`    | `string`          | ISO date string of when the action occurred.       |

**Tip:** You can import the `CFCustomTable` type directly from the library:
```typescript
import { type CFCustomTable } from '@final-commerce/command-frame';
```

## Custom Table Object Structure

Each custom table object (`CFCustomTable`) includes:

| Field         | Type                                   | Description                              |
| :------------ | :------------------------------------- | :--------------------------------------- |
| `_id`         | `string`                               | Unique identifier for the custom table.  |
| `name`        | `string`                               | Name of the custom table.                |
| `description` | `string` (optional)                    | Description of the custom table.         |
| `metadata`    | `Array<{ key: string; value: any }>` (optional) | Array of key-value pairs for storing custom data. |

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

try {
  // Get all custom tables
  const result = await command.getCustomTables();
  
  console.log('Custom tables:', result.customTables);
  console.log('Number of tables:', result.customTables.length);
  
  // Access specific table data
  result.customTables.forEach(table => {
    console.log(`Table: ${table.name}`);
    console.log(`  ID: ${table._id}`);
    console.log(`  Description: ${table.description || 'N/A'}`);
    
    if (table.metadata) {
      table.metadata.forEach(item => {
        console.log(`  ${item.key}: ${item.value}`);
      });
    }
  });

  // Expected output:
  // {
  //   success: true,
  //   customTables: [
  //     {
  //       _id: '507f1f77bcf86cd799439011',
  //       name: 'Loyalty Points',
  //       description: 'Customer loyalty program tracking',
  //       metadata: [
  //         { key: 'pointsPerDollar', value: 10 },
  //         { key: 'redemptionRate', value: 0.01 }
  //       ]
  //     },
  //     {
  //       _id: '507f1f77bcf86cd799439012',
  //       name: 'Gift Cards',
  //       description: 'Gift card balances and tracking'
  //     }
  //   ],
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

} catch (error) {
  console.error('Failed to get custom tables:', error);
}
```

## Error Handling

This action typically does not throw errors unless there's an underlying system issue. If no custom tables exist, it returns an empty array.

## Notes

- Returns all custom tables associated with the current company.
- Custom tables are useful for storing business-specific data that doesn't fit into standard POS entities.
- The `metadata` field allows flexible key-value storage for each table.
- Custom tables are created and managed through the Scale management interface.
