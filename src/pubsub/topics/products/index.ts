/**
 * Products Topic Definition
 * Defines the products topic and its available event types
 */

import type { TopicDefinition } from '../../types';

export const productsTopic: TopicDefinition = {
  id: 'products',
  name: 'Products',
  description: 'Topic for product-related events',
  eventTypes: [
    {
      id: 'product-created',
      name: 'Product Created',
      description: 'Published when a new product is synced/created',
    },
    {
      id: 'product-updated',
      name: 'Product Updated',
      description: 'Published when a product is synced/updated',
    },
    {
      id: 'composite-changed',
      name: 'Composite Changed',
      description: "Published when a composite's part or item is synced; re-ask getProducts",
    },
    {
      id: 'catalog-visibility-changed',
      name: 'Catalog Visibility Changed',
      description: 'Published when a product is hidden or shown at an outlet; re-ask getProducts',
    },
    {
      id: 'inventory-changed',
      name: 'Inventory Changed',
      description: "Published when a variant's stock at an outlet syncs; re-ask getProducts",
    },
    {
      id: 'set-active-product',
      name: 'Set Active Product',
      description: 'Published when a product is set as the active product',
    },
    {
      id: 'get-active-product',
      name: 'Get Active Product',
      description: 'Published when a product is retrieved as the active product',
    },
  ],
};

// Re-export types
export * from './types';
