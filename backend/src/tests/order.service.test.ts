

import { orderServices } from "../services/orderServices";

describe("orderServices", () => {
    const storeId = "store1";

    const fakeOrder = {
        _id: "order1",
        storeId: {
            toString: () => storeId,
        },
        orderStatus: "Pending",
    };

    describe("updateOrderStatus", () => {
        it("should return 404 if order not found", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue(null),
                updateStatus: jest.fn(),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Processing",
                storeId
            );

            expect(result).toEqual({
                status: 404,
                msg: "Order not found",
            });
        });

        it("should return 404 if order does not belong to this shop", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    storeId: {
                        toString: () => "anotherStore",
                    },
                }),
                updateStatus: jest.fn(),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Processing",
                storeId
            );

            expect(result).toEqual({
                status: 404,
                msg: "error",
            });
        });

        it("should return 200 if order moves from Pending to Processing", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    orderStatus: "Pending",
                }),
                updateStatus: jest.fn().mockResolvedValue(true),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Processing",
                storeId
            );

            expect(result).toEqual({
                status: 200,
                msg: "Order status updated successfully.",
            });
        });

        it("should return 200 if order moves from Processing to Shipped", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    orderStatus: "Processing",
                }),
                updateStatus: jest.fn().mockResolvedValue(true),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Shipped",
                storeId
            );

            expect(result).toEqual({
                status: 200,
                msg: "Order status updated successfully.",
            });
        });

        it("should return 200 if order moves from Shipped to Delivered", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    orderStatus: "Shipped",
                }),
                updateStatus: jest.fn().mockResolvedValue(true),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Delivered",
                storeId
            );

            expect(result).toEqual({
                status: 200,
                msg: "Order status updated successfully.",
            });
        });

        it("should return 200 if order is cancelled successfully", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    orderStatus: "Pending",
                }),
                updateStatus: jest.fn().mockResolvedValue(true),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Cancelled",
                storeId
            );

            expect(result).toEqual({
                status: 200,
                msg: "Order status updated successfully.",
            });
        });

        it("should return 400 if order cannot be moved to next status", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    orderStatus: "Delivered",
                }),
                updateStatus: jest.fn(),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Shipped",
                storeId
            );

            expect(result).toEqual({
                status: 400,
                msg: "Cannot move order from Delivered to Shipped",
            });
        });

        it("should return 400 if cancelled order cannot be moved", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    orderStatus: "Cancelled",
                }),
                updateStatus: jest.fn(),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Processing",
                storeId
            );

            expect(result).toEqual({
                status: 400,
                msg: "Cannot move order from Cancelled to Processing",
            });
        });

        it("should return 400 if requested status is not the real next status", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    orderStatus: "Pending",
                }),
                updateStatus: jest.fn(),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Shipped",
                storeId
            );

            expect(result).toEqual({
                status: 400,
                msg: "Invalid status transition from Pending to Shipped",
            });
        });

        it("should return 200 if order moves from Processing to Cancelled", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    orderStatus: "Processing",
                }),
                updateStatus: jest.fn().mockResolvedValue(true),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Cancelled",
                storeId
            );

            expect(result).toEqual({
                status: 200,
                msg: "Order status updated successfully.",
            });
        });

        it("should return 400 if Shipped order cannot be cancelled", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    orderStatus: "Shipped",
                }),
                updateStatus: jest.fn(),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Cancelled",
                storeId
            );

            expect(result).toEqual({
                status: 400,
                msg: "Cannot move order from Shipped to Cancelled",
            });
        });

        it("should return 400 if Delivered order cannot be cancelled", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    orderStatus: "Delivered",
                }),
                updateStatus: jest.fn(),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Cancelled",
                storeId
            );

            expect(result).toEqual({
                status: 400,
                msg: "Cannot move order from Delivered to Cancelled",
            });
        });

        it("should return 400 if Cancelled order cannot be cancelled again", async () => {
            const fakeRepo = {
                findById: jest.fn().mockResolvedValue({
                    ...fakeOrder,
                    orderStatus: "Cancelled",
                }),
                updateStatus: jest.fn(),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.updateOrderStatus(
                "order1",
                "Cancelled",
                storeId
            );

            expect(result).toEqual({
                status: 400,
                msg: "Cannot move order from Cancelled to Cancelled",
            });
        });



    });

    describe("getOrdersTrader", () => {
        it("should return 200 with trader paid orders", async () => {
            const orders = {
                data: [fakeOrder],
                page: 1,
                totalPages: 1,
                total: 1,
            };

            const fakeRepo = {
                findPaidOrders: jest.fn().mockResolvedValue(orders),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.getOrdersTrader(storeId, 1);

            expect(result).toEqual({
                status: 200,
                msg: orders,
            });
        });
    });

    describe("getTodaySells", () => {
        it("should return 200 with today sales", async () => {
            const sales = {
                totalSales: 500,
                totalOrders: 3,
            };

            const fakeRepo = {
                getTodaySales: jest.fn().mockResolvedValue(sales),
            };

            const service = new orderServices(fakeRepo as any);

            const result = await service.getTodaySells(storeId);

            expect(result).toEqual({
                status: 200,
                msg: sales,
            });
        });
    });
});