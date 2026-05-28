import express, { Request, Response, Router } from "express";
import asyncHandler from "../Errors/asyncHandler";
import { TraderMiddleware } from "../middleware/middleware";


import { ShopOwnerMiddleware } from "../middleware/shopmiddlware";
import { orderRepository } from "../Repository/order";
import { orderServices } from "../services/orderServices";





class orderRoutes {
  public router: Router;
  private Services: orderServices


  constructor(
    private traderMiddleware: TraderMiddleware,
    private shopOwnerMiddleware: ShopOwnerMiddleware,
    private orderRepo: orderRepository
  ) {


    this.router = express.Router();
    this.Services = new orderServices(this.orderRepo);
    this.routes();
  }

  private routes() {


    this.router.get(
      "/orders",
      this.traderMiddleware.handle,
      this.shopOwnerMiddleware.handle,

      asyncHandler(async (req: any, res: Response) => {
        const page = Number(req.query.page) || 1;
        const { status, msg } = await this.Services.getOrdersTrader(
        req.query.id,
        page,

      );
        return res.status(status).json(msg);
      })
    );


     this.router.post(
      "/orders",
      this.traderMiddleware.handle,
      this.shopOwnerMiddleware.handle,

      asyncHandler(async (req: any, res: Response) => {
        const { id, _id, orderStatus } = req.body
        const { status, msg } = await this.Services.updateOrderStatus(
        _id,
        orderStatus,
        id
      );
        return res.status(status).json(msg);
      })
    );



  }
}

const shopRoute = new orderRoutes(
  new TraderMiddleware(),
  new ShopOwnerMiddleware(),
  new orderRepository()
).router;

export default shopRoute;