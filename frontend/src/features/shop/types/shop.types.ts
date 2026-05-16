// src/features/shop/types/shop.types.ts

export type CreateShopInput = {
  websiteId: string;
  ShopName: string;
  shopNumber: string;
};

export type FindShopInput = {
  websiteId: string;
};

export type EditShopInput = {
  id: string;
  ShopName: string;
  logo?: string;
  description?: string;
  shopNumber?: string;
  defaultCurrency?: string;
  LyPayInfo?: any;
};

export type GetShopInput = {
  id: string;
};

export type CategoryInput = {
  id: string;
};

export type EditCategoryInput = {
  id: string;
  categorys: string[];
};

export type DomainRequestInput = {
  id: string;
  domain: string;
};

export type AcceptRejectDomainInput = {
  id: string;
};

export type GetBalanceInput = {
  storeId: string;
};

export type UpdatePaymentsInput = {
  storeId: string;
  payments: string[];
};

export type SearchInput = {
  q: string;
};

export type SearchAllInput = {
  q: string;
  page: number;
};

export type UpdateStatusInput = {
  _id: string;
  Status: "active" | "banned";
};

export type UpdateBillsInput = {
  _id: string;
  amount: number;
};