// src/features/order/api/orderKeys.ts

export const orderKeys = {
  all: ["orders"] as const,

  trader: () => [...orderKeys.all, "trader"] as const,
  traderList: (storeId: string, page: number) =>
    [...orderKeys.trader(), "list", storeId, page] as const,

  traderDaySells: (storeId: string) =>
    [...orderKeys.trader(), "day-sells", storeId] as const,

  traderHistorySells: (storeId: string, startDate: string, endDate: string) =>
    [...orderKeys.trader(), "history-sells", storeId, startDate, endDate] as const,

  traderMonthlySells: (storeId: string, month: number, year: number) =>
    [...orderKeys.trader(), "monthly-sells", storeId, month, year] as const,

  customer: () => [...orderKeys.all, "customer"] as const,
  customerList: (storeId: string, page: number) =>
    [...orderKeys.customer(), "list", storeId, page] as const,

  admin: () => [...orderKeys.all, "admin"] as const,
  adminDaySells: () => [...orderKeys.admin(), "day-sells"] as const,
  adminHistorySells: (startDate: string, endDate: string) =>
    [...orderKeys.admin(), "history-sells", startDate, endDate] as const,
  adminMonthlySells: (month: number, year: number) =>
    [...orderKeys.admin(), "monthly-sells", month, year] as const,
};