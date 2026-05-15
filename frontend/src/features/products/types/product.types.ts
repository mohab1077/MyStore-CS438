// src/features/product/types/product.types.ts

export type ProductAttribute = {
  name: string;
  value: string;
};

export type ProductStatus = "active" | "hidden";

export type CreateProductInput = {
  id: string; // store/shop id
  name: string;
  price: number;
  description?: string;
  imgs: string[];
  attributes: ProductAttribute[];
  stock: number;
  category: string;
};

export type EditProductInput = {
  id: string; // store/shop id
  _id: string; // product id
  name: string;
  price: number;
  description?: string;
  imgs: string[];
  attributes: ProductAttribute[];
  stock: number;
  category: string;
  statuss?: ProductStatus;
};

export type DeleteProductInput = {
  id: string; // store/shop id
  _id: string; // product id
};

export type GetProductsInput = {
  websiteId: string;
  page?: number;
};

export type GetProductsByCategoryInput = {
  websiteId: string;
  category: string;
  page?: number;
};

export type SearchProductsInput = {
  websiteId: string;
  q: string;
};

export type SearchAllProductsInput = {
  websiteId: string;
  q: string;
  page?: number;
};

export type GetTraderProductsInput = {
  id: string;
  page?: number;
};

export type GetTraderProductsByCategoryInput = {
  storeID: string;
  category: string;
  page?: number;
};

export type SearchTraderProductsInput = {
  storeID: string;
  q: string;
};

export type SearchAllTraderProductsInput = {
  storeID: string;
  q: string;
  page?: number;
};