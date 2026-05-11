import type { TopicDefinition } from "../../types";

export const categoriesTopic: TopicDefinition = {
    id: "categories",
    name: "Categories",
    description: "Topic for product category changes synced from the database",
    eventTypes: [
        {
            id: "category-created",
            name: "Category Created",
            description: "Published when a new category is synced/created"
        },
        {
            id: "category-updated",
            name: "Category Updated",
            description: "Published when a category is synced/updated"
        }
    ]
};

export * from "./types";
