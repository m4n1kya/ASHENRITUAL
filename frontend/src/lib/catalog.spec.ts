/**
 * @fileoverview Unit Tests for ASHEN Archival Catalog & Resilient Filtering
 * @module catalog.spec.ts
 */

import {
  ASHEN_PRODUCTS,
  ASHEN_CATEGORIES,
  filterAndSortCatalog,
  getCatalogProductById,
} from './catalog';

describe('ASHEN Archival Catalog', () => {
  it('contains products across all major categories', () => {
    expect(ASHEN_PRODUCTS.length).toBeGreaterThan(15);
    expect(ASHEN_CATEGORIES.length).toBeGreaterThanOrEqual(6);

    const categoriesInProducts = new Set(ASHEN_PRODUCTS.map((p) => p.category.slug));
    expect(categoriesInProducts.has('outerwear')).toBe(true);
    expect(categoriesInProducts.has('suits')).toBe(true);
    expect(categoriesInProducts.has('shirts')).toBe(true);
    expect(categoriesInProducts.has('tshirts')).toBe(true);
    expect(categoriesInProducts.has('footwear')).toBe(true);
  });

  it('every product has valid price, name, images, and description', () => {
    for (const product of ASHEN_PRODUCTS) {
      expect(product.id).toBeDefined();
      expect(product.name.trim().length).toBeGreaterThan(0);
      expect(product.price).toBeGreaterThan(0);
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.images[0].startsWith('/images/clothes/')).toBe(true);
      expect(product.description.trim().length).toBeGreaterThan(0);
      expect(product.category).toBeDefined();
    }
  });

  it('filters products accurately by category slug', () => {
    const suitsResult = filterAndSortCatalog({ category: 'suits' });
    expect(suitsResult.data.length).toBeGreaterThan(0);
    suitsResult.data.forEach((p) => {
      expect(p.category.slug).toBe('suits');
    });

    const shirtsResult = filterAndSortCatalog({ category: 'shirts' });
    expect(shirtsResult.data.length).toBeGreaterThan(0);
    shirtsResult.data.forEach((p) => {
      expect(p.category.slug).toBe('shirts');
    });
  });

  it('sorts products by price ascending and descending', () => {
    const ascResult = filterAndSortCatalog({ sort: 'price_asc', limit: 50 });
    for (let i = 0; i < ascResult.data.length - 1; i++) {
      expect(ascResult.data[i].price).toBeLessThanOrEqual(ascResult.data[i + 1].price);
    }

    const descResult = filterAndSortCatalog({ sort: 'price_desc', limit: 50 });
    for (let i = 0; i < descResult.data.length - 1; i++) {
      expect(descResult.data[i].price).toBeGreaterThanOrEqual(descResult.data[i + 1].price);
    }
  });

  it('searches products by query string', () => {
    const searchResult = filterAndSortCatalog({ query: 'leather' });
    expect(searchResult.data.length).toBeGreaterThan(0);
    searchResult.data.forEach((p) => {
      const match =
        p.name.toLowerCase().includes('leather') ||
        p.description.toLowerCase().includes('leather') ||
        p.tags?.some((t) => t.toLowerCase().includes('leather'));
      expect(match).toBe(true);
    });
  });

  it('retrieves products by ID', () => {
    const product = getCatalogProductById('prod-charcoal-overcoat');
    expect(product).not.toBeNull();
    expect(product?.name).toBe('Charcoal Overcoat');
    expect(product?.price).toBe(18990);
  });
});
