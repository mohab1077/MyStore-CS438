import express, { Request, Response, Router } from "express";
import asyncHandler from "../Errors/asyncHandler";
import { TraderMiddleware } from "../middleware/middleware";


import { ShopOwnerMiddleware } from "../middleware/shopmiddlware";
import { ShopRepository } from "../Repository/shop";
import { shopServices } from "../services/shopServices";
import { Shop } from "../classes/shop";
import { PhoneValidator, ShopNameValidator } from "../Errors/validations";

console.log("SHOP ROUTE FILE LOADED");

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

class shopRoutes {
  public router: Router;
  private Services: shopServices


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


    this.router.post(
      "/CreateShop",
      this.traderMiddleware.handle,
      asyncHandler(async (req: any, res: Response) => {
        const traderId = req.user!._id;

        const { websiteId, ShopName, shopNumber } = req.body;
        const validators = [
          ShopNameValidator.safeParse(ShopName),
          PhoneValidator.safeParse(shopNumber),
        ];

        for (const check of validators) {
          if (!check.success) {
            return res.status(400).json(check.error.issues[0].message);
          }
        }

        const newShop = new Shop(
          websiteId,
          traderId,
          ShopName,
          shopNumber,
          []
        );

        const { status, msg } = await this.Services.createShop(newShop);

        return res.status(status).json(msg);
      })
    );

    this.router.get(
      "/myshops",
      this.traderMiddleware.handle,
      asyncHandler(async (req: AuthRequest, res: Response) => {
        const traderId = req.user!._id;
        const { status, msg } =
          await this.Services.getMyShops(traderId);
        return res.status(status).json(msg);
      })
    );

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