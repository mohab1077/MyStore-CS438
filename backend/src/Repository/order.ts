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
  async findPaidOrders(storeId: string, page: number) {
    const LIMIT = 25
    const skip = (page - 1) * LIMIT;
    const findOrders = await orderModel.find({ storeId, paymentStatus: 'paid' }).sort({ createdAt: -1 })
      .skip(skip)
      .limit(LIMIT);
    const total = await orderModel.countDocuments({ storeId, paymentStatus: 'paid' });
    return ({
      status: 200, msg: {
        data: findOrders,
        page,
        totalPages: Math.ceil(total / LIMIT),
        total,
      }
    })
  }
}