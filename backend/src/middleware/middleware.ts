import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { usermodel } from "../modules/user";

type Role = "admin" | "trader" | "customer";

export interface AuthRequest extends Request {
  user?: any;
}

abstract class BaseRoleMiddleware {
  protected abstract allowedRole: Role;

  handle = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authorizationHeader = req.get("authorization");

      if (!authorizationHeader) {
        return res.status(401).json({
          message: "No auth",
        });
      }

      const token = authorizationHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          message: "No token",
        });
      }

      const payload = jwt.verify(
        token,
        process.env.jwtpass || ""
      ) as {
        email: string;
      };

      const user = await usermodel.findOne({
        email: payload.email,
      });

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      if (user.type !== this.allowedRole) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      req.user = user;

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  };
}

export class AdminMiddleware extends BaseRoleMiddleware {
  protected allowedRole: Role = "admin";
}

export class TraderMiddleware extends BaseRoleMiddleware {
  protected allowedRole: Role = "trader";
}

