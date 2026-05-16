// src/features/shop/api/shopKeys.ts

export const shopKeys = {
  all: ["shops"] as const,

  my: () => [...shopKeys.all, "my"] as const,
  one: (id: string) => [...shopKeys.all, "one", id] as const,

  category: (id: string) => [...shopKeys.all, "category", id] as const,

  domainRequests: (page: number) =>
    [...shopKeys.all, "domain-requests", page] as const,

  adminList: (page: number) =>
    [...shopKeys.all, "admin", page] as const,

  search: (q: string) =>
    [...shopKeys.all, "search", q] as const,
};