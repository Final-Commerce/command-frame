# getCustomTableFields

Retrieves all fields (schema definition) for a specific custom table. Each field defines the structure and data type for entries in that custom table.

## Parameters

| Parameter | Type     | Required | Description                          |
| :-------- | :------- | :------- | :----------------------------------- |
| `tableId` | `string` | Yes      | The ID of the custom table to get fields for. |

## Response

`Promise<GetCustomTableFieldsResponse>`

| Field       | Type                   | Description                                        |
| :---------- | :--------------------- | :------------------------------------------------- |
| `success`   | `boolean`              | `true` if fields were retrieved successfully.      |
| `fields`    | `CFCustomTableField[]` | Array of field definitions for the custom table.   |
| `timestamp` | `string`               | ISO date string of when the action occurred.       |

**Tip:** You can import the `CFCustomTableField` and `AttributeType` types directly from the library:
```typescript
import { type CFCustomTableField, AttributeType } from '@final-commerce/command-frame';
```

## Custom Table Field Object Structure

Each field object (`CFCustomTableField`) includes:

| Field                       | Type            | Description                                          |
| :-------------------------- | :-------------- | :--------------------------------------------------- |
| `_id`                       | `string`        | Unique identifier for the field.                     |
| `tableId`                   | `string`        | ID of the parent custom table.                       |
| `name`                      | `string`        | Name of the field.                                   |
| `type`                      | `AttributeType` | Data type of the field (see below).                  |
| `required`                  | `boolean` (optional) | Whether this field is required.                 |
| `defaultValue`              | `any` (optional) | Default value for the field.                        |
| `referenceLinkedCollection` | `string` (optional) | Linked collection for reference fields.          |
| `referenceLinkedField`      | `string` (optional) | Linked field name for reference fields.          |

### Field Types (`AttributeType`)

| Type          | Value          | Description                    |
| :------------ | :------------- | :----------------------------- |
| `STRING`      | `'string'`     | Text value                     |
| `NUMBER`      | `'number'`     | Numeric value                  |
| `BOOLEAN`     | `'boolean'`    | True/false value               |
| `DATE`        | `'date'`       | Date/datetime value            |
| `JSON_STRING` | `'json-string'`| JSON string value              |

## Example Usage

```typescript
import { command, AttributeType } from '@final-commerce/command-frame';

try {
  // First, get all custom tables to find the table ID
  const tablesResult = await command.getCustomTables();
  const loyaltyTable = tablesResult.customTables.find(t => t.name === 'Loyalty Points');
  
  if (loyaltyTable) {
    // Get fields for the loyalty table
    const result = await command.getCustomTableFields({ 
      tableId: loyaltyTable._id 
    });
    
    console.log('Table fields:', result.fields);
    
    // Access field information
    result.fields.forEach(field => {
      console.log(`Field: ${field.name}`);
      console.log(`  Type: ${field.type}`);
      console.log(`  Required: ${field.required || false}`);
      
      // Check for reference fields
      if (field.referenceLinkedCollection) {
        console.log(`  Links to: ${field.referenceLinkedCollection}.${field.referenceLinkedField}`);
      }
    });
    
    // Check field types using the enum
    const stringFields = result.fields.filter(f => f.type === AttributeType.STRING);
    console.log('String fields:', stringFields.map(f => f.name));
  }

  // Expected output:
  // {
  //   success: true,
  //   fields: [
  //     {
  //       _id: '507f1f77bcf86cd799439021',
  //       tableId: '507f1f77bcf86cd799439011',
  //       name: 'customerId',
  //       type: 'string',
  //       required: true
  //     },
  //     {
  //       _id: '507f1f77bcf86cd799439022',
  //       tableId: '507f1f77bcf86cd799439011',
  //       name: 'points',
  //       type: 'number',
  //       required: true,
  //       defaultValue: 0
  //     },
  //     {
  //       _id: '507f1f77bcf86cd799439023',
  //       tableId: '507f1f77bcf86cd799439011',
  //       name: 'lastUpdated',
  //       type: 'date',
  //       required: false
  //     }
  //   ],
  //   timestamp: '2023-10-27T10:00:00.000Z'
  // }

} catch (error) {
  console.error('Failed to get custom table fields:', error);
}
```

## Error Handling

This action returns an empty array if:
- The specified table ID does not exist
- The table has no fields defined

The action may throw an error if there's an underlying system issue.

## Notes

- Custom table fields define the schema/structure for data stored in custom tables.
- Use this action to understand what data can be stored in a custom table.
- Fields can have different types to support various data formats.
- Required fields must have values when creating entries in the custom table.
- Default values are used when a field value is not explicitly provided.
- Reference fields (`referenceLinkedCollection` and `referenceLinkedField`) allow linking to other collections.
- Custom tables and their fields are created and managed through the Scale management interface.
