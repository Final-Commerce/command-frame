# getAddressOptions

The countries and provinces an address form offers.

```ts
const { countries, defaultCountry } = await renderClient.getAddressOptions({ locale: 'fr-CA' });
```

Render them as dropdowns and keep no list in the flow: what the customer picks is then always a
code the shipping rules match (`CA`, `QC`). A country with an empty `provinces` list gets a free
text field instead.

| name     | required | notes                                   |
| -------- | -------- | --------------------------------------- |
| `locale` | no       | Names in this locale. Defaults to `en`. |

`defaultCountry` is the store's own country, to preselect. Served by the till and the website.
