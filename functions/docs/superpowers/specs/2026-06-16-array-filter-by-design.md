# array-filter-by — Design Spec

## Summary

New function `array-filter-by` that filters a source array using another array as the filter criteria. Supports include (intersection) and exclude (difference) modes. Follows existing array function conventions.

## Inputs

| Param | Type | Required | Notes |
|---|---|---|---|
| `array` | ARRAY / COLLECTION | yes | Source array to filter |
| `filterArray` | ARRAY / COLLECTION | yes | Array of values/objects to filter by |
| `path` | Text | no | Dot-separated path into source array items (for objects) |
| `filterPath` | Text | no | Dot-separated path into filter array items (for objects) |
| `mode` | Select (`include` / `exclude`) | yes | `include` keeps matches, `exclude` removes matches |

## Outputs

- `resultSchema` — Array output with schemaModel (mirrors `array-filter`)
- `resultModel` — Collection output (mirrors `array-filter`)

## Logic

1. Extract comparison values from `filterArray` using `filterPath` (or whole items if no path) → store in a `Set` for O(1) lookup
2. For each item in `array`, extract comparison value using `path` (or use whole item)
3. Check Set membership
4. `include` mode: keep item if found in Set
5. `exclude` mode: keep item if NOT found in Set

## File Structure

```
functions/array-filter-by/
  1.0/
    index.js
    function.json
```

## Conventions

- Mirrors `array-filter` structure exactly (icon color Blue, category Array, yields NONE)
- Uses shared `travelPath` helper inline (same pattern as other functions)
- Error thrown if `array` or `mode` missing
- `resultSchema` + `resultModel` both returned on success
