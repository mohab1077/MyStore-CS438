// src/features/product/api/productKeys.ts

export const productKeys = {
  all: ["products"] as const,

  public: () => [...productKeys.all, "public"] as const,
  publicList: (websiteId: string, page: number) =>
    [...productKeys.public(), "list", websiteId, page] as const,

  publicCategory: (websiteId: string, category: string, page: number) =>
    [...productKeys.public(), "category", websiteId, category, page] as const,

  publicSearch: (websiteId: string, q: string) =>
    [...productKeys.public(), "search", websiteId, q] as const,

  publicSearchAll: (websiteId: string, q: string, page: number) =>
    [...productKeys.public(), "search-all", websiteId, q, page] as const,

  trader: () => [...productKeys.all, "trader"] as const,
  traderList: (storeID: string, page: number) =>
    [...productKeys.trader(), "list", storeID, page] as const,

  traderCategory: (storeID: string, category: string, page: number) =>
    [...productKeys.trader(), "category", storeID, category, page] as const,

  traderSearch: (storeID: string, q: string) =>
    [...productKeys.trader(), "search", storeID, q] as const,

  traderSearchAll: (storeID: string, q: string, page: number) =>
    [...productKeys.trader(), "search-all", storeID, q, page] as const,
};