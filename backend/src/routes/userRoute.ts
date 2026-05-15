import express, { Request, Response, Router } from "express";

import asyncHandler from "../Errors/asyncHandler";
import { Authentication, TraderAndAdminLogin } from "../classes/Authentication";




export class AuthRoutes {
  public router: Router;

  constructor() {
    
    this.router = express.Router();
    this.routes();
  }

  private routes() {

    // login
    this.router.post(
      "/login",

      asyncHandler(async (req: Request, res: Response) => {
      
        const { email, password } = req.body;

        const authenticationUser = new Authentication(
          new TraderAndAdminLogin()
        );

        const { status, msg, access } =
          await authenticationUser.login({
            email,
            password,
          });

        return res.status(status).json({
          msg,
          access,
        });
      })
    );



    
  }
}

export default new AuthRoutes().router;