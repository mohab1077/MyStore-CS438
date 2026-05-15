export interface AuthRequest extends Request {
  user?: any;
  shop?: any;
}
import type { Request, Response, NextFunction } from "express";


export class ShopOwnerMiddleware {
  handle = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const rawId = req.body?.id ?? req.query?.id;

      const shopId = String(rawId);
      console.log("hi")

      if (!shopId) {
        return res.status(400).json({
          message: "Shop ID is required",
        });
      }

      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const shop: Ishop | null = await shopModel.findOne({
        _id: shopId,
        userId: req.user._id,
      });

      if (!shop) {
        return res.status(403).json({
          message: "This shop does not belong to this trader",
        });
      }

      req.shop = new Shop(
        shop.websiteId,
        shop.userId.toString(),
        shop.ShopName,
        shop.shopNumber,
        shop.category,
        shop._id.toString()
      );

      next();
    } catch {
      return res.status(500).json({
        message: "Server error",
      });
    }
  };
}