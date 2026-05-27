export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderState {
  next(context: OrderContext): boolean;
  cancel(context: OrderContext): boolean;
  getStatus(): OrderStatus;
}

export class PendingState implements OrderState {
  next(context: OrderContext): boolean {
    context.setState(new ProcessingState());
    return true;
  }

  cancel(context: OrderContext): boolean {
    context.setState(new CancelledState());
    return true;
  }

  getStatus(): OrderStatus {
    return "Pending";
  }
}

export class ProcessingState implements OrderState {
  next(context: OrderContext): boolean {
    context.setState(new ShippedState());
    return true;
  }

  cancel(context: OrderContext): boolean {
    context.setState(new CancelledState());
    return true;
  }

  getStatus(): OrderStatus {
    return "Processing";
  }
}

export class ShippedState implements OrderState {
  next(context: OrderContext): boolean {
    context.setState(new DeliveredState());
    return true;
  }

  cancel(): boolean {
    return false;
  }

  getStatus(): OrderStatus {
    return "Shipped";
  }
}

export class DeliveredState implements OrderState {
  next(): boolean {
    return false;
  }

  cancel(): boolean {
    return false;
  }

  getStatus(): OrderStatus {
    return "Delivered";
  }
}

export class CancelledState implements OrderState {
  next(): boolean {
    return false;
  }

  cancel(): boolean {
    return false;
  }

  getStatus(): OrderStatus {
    return "Cancelled";
  }
}

export class OrderContext {
  constructor(private state: OrderState) {}

  setState(state: OrderState) {
    this.state = state;
  }

  proceedToNext(): boolean {
    return this.state.next(this);
  }

  cancelOrder(): boolean {
    return this.state.cancel(this);
  }

  getStatus(): OrderStatus {
    return this.state.getStatus();
  }
}