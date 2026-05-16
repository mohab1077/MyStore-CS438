import express, { Request, Response, Router } from "express";
import asyncHandler from "../Errors/asyncHandler";
import { TraderMiddleware } from "../middleware/middleware";


import { ShopOwnerMiddleware } from "../middleware/shopmiddlware";
import { ShopRepository } from "../Repository/shop";
import { shopServices } from "../services/shopServices";

console.log("SHOP ROUTE FILE LOADED");

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

class shopRoutes {
  public router: Router;
  private Services : shopServices
  

  constructor(
    private traderMiddleware: TraderMiddleware,
    private shopOwnerMiddleware: ShopOwnerMiddleware,
    private shopRepo: ShopRepository
  ) {


    this.router = express.Router();
    this.Services = new shopServices(this.shopRepo);
    this.routes();
  }

  private routes() {


    
   
    // get categories
        this.router.get(
          "/category",
          this.traderMiddleware.handle,
          this.shopOwnerMiddleware.handle,
    
          asyncHandler(async (req: any, res: Response) => {
            const shop = req?.shop
            
            return res.status(200).json(shop.category);
          })
        );
    
    
    
        // update categories
        this.router.put(
          "/category",
          this.traderMiddleware.handle,
          this.shopOwnerMiddleware.handle,
    
          asyncHandler(async (req: any, res: Response) => {
            const shop = req?.shop
            const { id, categorys } = req.body;
            shop.category = categorys;
            const { status, msg } = await this.Services.editCategory(shop)
    
            return res.status(status).json(msg);
          })
        );

  }
}

const shopRoute = new shopRoutes(
  new TraderMiddleware(),
  new ShopOwnerMiddleware(),
  new ShopRepository()
).router;

export default shopRoute;