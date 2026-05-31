import { OrderContext, OrderStatus } from "../classes/orderState";
import { OrderStateFactory } from "../classes/orderStateFactory";
import { orderRepository } from "../Repository/order";

export class orderServices {
    constructor(private orderRepo: orderRepository) { }


    async updateOrderStatus(
        orderId: string,
        newStatus: OrderStatus,
        storeId: string
    ) {
        const order = await this.orderRepo.findById(orderId);


        if (!order) {
            return {
                status: 404,
                msg: "Order not found",
            };
        }
        /// order id not blongs to shop ,, usually this is hacking ...
        if (storeId != order.storeId.toString()) {
            return {
                status: 404,
                msg: "error",
            };
        }

        const context = new OrderContext(
            OrderStateFactory.create(order.orderStatus)
        );

        const isChanged =
            newStatus === "Cancelled"
                ? context.cancelOrder()
                : context.proceedToNext();

        if (!isChanged) {
            return {
                status: 400,
                msg: `Cannot move order from ${order.orderStatus} to ${newStatus}`,
            };
        }

        const finalStatus = context.getStatus();

        if (finalStatus !== newStatus) {
            return {
                status: 400,
                msg: `Invalid status transition from ${order.orderStatus} to ${newStatus}`,
            };
        }

        await this.orderRepo.updateStatus(orderId, finalStatus);

        return {
            status: 200,
            msg: "Order status updated successfully.",
        };
    }

    async getOrdersTrader(storeId: string, page: number) {

        const findOrders = await this.orderRepo.findPaidOrders(storeId, page)
        return ({
            status: 200, msg: findOrders
        })
    }
}