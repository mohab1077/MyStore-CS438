import { CancelledState, DeliveredState, OrderState, OrderStatus, PendingState, ProcessingState, ShippedState } from "./orderState";

export class OrderStateFactory {
  static create(status: OrderStatus): OrderState {
    switch (status) {
      case "Pending":
        return new PendingState();

      case "Processing":
        return new ProcessingState();

      case "Shipped":
        return new ShippedState();

      case "Delivered":
        return new DeliveredState();

      case "Cancelled":
        return new CancelledState();

      default:
        throw new Error("Invalid order status");
    }
  }
}