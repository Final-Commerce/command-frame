/**
 * Mongo-lite query evaluator for mock getters.
 *
 * The real host resolves `query` objects against MongoDB; standalone/mock mode
 * previously understood only the non-contract `searchValue` convenience key, so
 * contract-style queries ({ $or: [{ name: { $regex, $options } }, ...] },
 * { _id: ... }) silently returned the full dataset. This covers the subset the
 * hosts and generated flows actually send: $or / $and, $regex with $options,
 * $in, and plain equality (array fields match by inclusion, mirroring Mongo's
 * array-contains semantics). The non-standard `$contains` key used by some
 * older builds is kept as an alias for array inclusion.
 */

const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

const matchesCondition = (doc: object, field: string, condition: unknown): boolean => {
    const value = (doc as Record<string, unknown>)[field];
    const cond = asRecord(condition);
    if (cond) {
        if ("$regex" in cond) {
            if (typeof value !== "string") return false;
            try {
                const flags = typeof cond.$options === "string" ? cond.$options : "";
                return new RegExp(String(cond.$regex), flags).test(value);
            } catch {
                return false;
            }
        }
        if ("$in" in cond) {
            const list: unknown[] = Array.isArray(cond.$in) ? cond.$in : [];
            return Array.isArray(value) ? value.some(v => list.includes(v)) : list.includes(value);
        }
        if ("$contains" in cond) {
            return Array.isArray(value) && value.includes(cond.$contains);
        }
    }
    // Mongo semantics: an equality match on an array field means "array contains".
    if (Array.isArray(value)) return value.includes(condition);
    return value === condition;
};

export const matchesMongoQuery = (doc: object, query: unknown): boolean => {
    const q = asRecord(query);
    if (!q) return true;
    return Object.entries(q).every(([key, value]) => {
        if (key === "$or") return Array.isArray(value) && value.some(sub => matchesMongoQuery(doc, sub));
        if (key === "$and") return Array.isArray(value) && value.every(sub => matchesMongoQuery(doc, sub));
        // Legacy mock-only convenience key — applied by the individual getters, not a field.
        if (key === "searchValue") return true;
        return matchesCondition(doc, key, value);
    });
};
