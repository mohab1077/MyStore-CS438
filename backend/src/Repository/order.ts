import { Types } from "mongoose";
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
    const LIMIT = 10
    const skip = (page - 1) * LIMIT;
    const findOrders = await orderModel.find({ storeId, paymentStatus: 'paid' }).sort({ createdAt: -1 })
      .skip(skip)
      .limit(LIMIT);
    if(!findOrders){
      return false
    }
    const total = await orderModel.countDocuments({ storeId, paymentStatus: 'paid' });
    return ({
        data: findOrders,
        page,
        totalPages: Math.ceil(total / LIMIT),
        total,
    })
  }

   async getTodaySales(storeId: string, start: Date, end: Date) {
    const salesToday = await orderModel.aggregate([
      {
        $match: {
          storeId: new Types.ObjectId(storeId),
          paymentStatus: "paid",
          orderDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          ordersCount: { $sum: 1 },
        },
      },
    ]);

    return salesToday[0] || { totalSales: 0, ordersCount: 0 };
  }
}