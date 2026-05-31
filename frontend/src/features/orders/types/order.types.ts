// src/features/order/types/order.types.ts

export type OrderStatus =
  | "processing"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type GetTraderOrdersInput = {
  storeId: string;
  page?: number;
};

export type EditTraderOrderInput = {
  id: string;
  _id: string;
  orderStatus: OrderStatus | string;
};

export type TraderSellsInput = {
  storeId: string;
};

export type TraderHistorySellsInput = {
  storeId: string;
  startDate: string;
  endDate: string;
};

export type TraderMonthlySellsInput = {
  storeId: string;
  month: number;
  year: number;
};

export type CreateOrderInput = {
  storeId: string;
  method: string;
  copon?: string;
  address: string;
};

export type CancelOrderInput = {
  _id: string;
  storeId: string;
};

export type ConfirmOrderInput = {
  _id: string;
  storeId: string;
};

export type GetCustomerOrdersInput = {
  storeId: string;
  page?: number;
};

export type AdminHistorySellsInput = {
  startDate: string;
  endDate: string;
};

export type AdminMonthlySellsInput = {
  month: number;
  year: number;
};