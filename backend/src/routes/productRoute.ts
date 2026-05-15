import express, { Request, Response, Router } from "express";
import asyncHandler from "../Errors/asyncHandler";

import { TraderMiddleware } from "../middleware/middleware";


import { ShopOwnerMiddleware } from "../middleware/shopmiddlware";
import { product } from "../classes/product";
import { ProductRepository } from "../Repository/product";





export class productRoute {
  public router: Router;

  constructor(
    private traderMiddleware: TraderMiddleware,
    private shopOwnerMiddleware: ShopOwnerMiddleware,
    private ProductRepo: ProductRepository,
   
  ) {
    this.router = express.Router();
    this.routes();
  }

  private routes() {

    
    // create product
    this.router.post(
      "/create",
      this.traderMiddleware.handle,
      this.shopOwnerMiddleware.handle,

      asyncHandler(async (req: any, res: Response) => {
      const shop = req?.shop
        const {
          id,
          name,
          price,
          description,
          imgs,
          attributes,
          stock,
          category,
        } = req.body;
        const statuss = "hidden";
        const prod = new product(id, name, price, description, imgs, attributes, stock, category, statuss)

        const { status, msg } =
          await createProductServices(prod, this.ProductRepo,shop.category);
        return res.status(status).json(msg);
      })
    );



    // edit product
    this.router.put(
      "/edit",
      this.traderMiddleware.handle,
      this.shopOwnerMiddleware.handle,

      asyncHandler(async (req: any, res: Response) => {
       const shop = req?.shop
        const {
          id,
          name,
          price,
          description,
          imgs,
          attributes,
          stock,
          category,
          _id,
          statuss,
        } = req.body;

        const prod = new product(id, name, price, description, imgs, attributes, stock, category, statuss, _id)
        const { status, msg } =  await editProductServices(prod, this.ProductRepo , shop.category );

        return res.status(status).json(msg);
      })
    );



    // delete product
    this.router.delete(
      "/prod",
      this.traderMiddleware.handle,
      this.shopOwnerMiddleware.handle,

      asyncHandler(async (req: any, res: Response) => {

        const { _id ,id } = req.body;
        const { status, msg } = await deleteProductServices(_id, id, this.ProductRepo);
        return res.status(status).json(msg);
      })
    );

    this.router.get(
      "/prod",
      this.traderMiddleware.handle,
      this.shopOwnerMiddleware.handle,

      asyncHandler(async (req: any, res: Response) => {

        
        const page = Number(req.query.page) || 1;


        const { status, msg } = await getProductServices(req.query.id, page, this.ProductRepo);

        return res.status(status).json(msg);
      })
    );
  }
}

export default new productRoute(
  new TraderMiddleware(),
  new ShopOwnerMiddleware(),
  new ProductRepository()
).router;