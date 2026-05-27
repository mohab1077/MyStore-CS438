import { OrderStatus } from "../classes/orderState";
import { IOrder, orderModel } from "../modules/order";

export class orderRepository {
    async findById(orderId: string): Promise<IOrder | null> {
    return await orderModel.findById(orderId);
  }

  async updateStatus(
    orderId: string,
    finalStatus: OrderStatus
  ): Promise<IOrder | null> {
    return await orderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: finalStatus }
    );
  }
}