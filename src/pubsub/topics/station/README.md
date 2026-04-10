# Station Topic

- **Topic ID**: `station`

## Events

| Event | Description |
|-------|-------------|
| `set-active-station` | Active station set |
| `get-active-station` | Active station published |

```typescript
topics.subscribe('station', e => console.log(e.type, e.data));
```
