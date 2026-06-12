import express, { Request, Response, Router } from "express";

import asyncHandler from "../Errors/asyncHandler";
import { Authentication, TraderAndAdminLogin } from "../classes/Authentication";
import { SignUpMangment, TraderSignup } from "../classes/SignUpMangment";
import { EmailValidator, NameValidator, PhoneValidator } from "../Errors/validations";
import { TraderMiddleware } from "../middleware/middleware";
import { UserServices } from "../services/userServices";
import { UserShopRepository } from "../Repository/user";




export class AuthRoutes {
  public router: Router;
  private Services: UserServices

  constructor(
    private traderMiddleware: TraderMiddleware,
    private userRepo: UserShopRepository
  ) {

    this.router = express.Router();
    this.Services = new UserServices(this.userRepo);
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


    // signup trader
    this.router.post(
      "/signup",

      asyncHandler(async (req: Request, res: Response) => {

        const {
          email,
          password,
          phone,
          name,
        } = req.body;

        const validators = [
          EmailValidator.safeParse(email),
          PhoneValidator.safeParse(phone),
          NameValidator.safeParse(name),
        ];

        for (const check of validators) {
          if (!check.success) {
            return res.status(400).json(check.error.issues[0].message);
          }
        }

        const account = new SignUpMangment(
          new TraderSignup()
        );

        const { status, msg } =
          await account.Signup({
            email,
            password,
            phone,
            name,
          });

        return res.status(status).json(msg);
      })
    );

    // get trader info
    this.router.get("/info", this.traderMiddleware.handle, asyncHandler(async (req: any, res) => {
      const myuser = req?.user?._id
      const { status, msg } = await this.Services.getinfo({ myuser })
      return res.status(status).json(msg)
    }))

    // edit trader info
    this.router.put("/info", this.traderMiddleware.handle, asyncHandler(async (req: any, res) => {
      const myuser = req?.user?._id
      const { email, phone } = req.body
      const { status, msg } = await this.Services.putinfo({ email, phone, myuser })
      return res.status(status).json(msg)
    }))

    this.router.post("/sendCode", asyncHandler(async (req, res) => {
      const { email } = req.body
      const { status, msg } = await this.Services.SendCode({ email })
      return res.status(status).json(msg)
    }))

    this.router.post("/ConfirmCode", asyncHandler(async (req, res) => {
      const { code, email } = req.body
      const { status, msg, access } = await this.Services.ConfirmCode({ code, email })
      return res.status(status).json({ msg, access })
    }))


    this.router.put("/pass", this.traderMiddleware.handle, asyncHandler(async (req: any, res) => {
      const myuser = req?.user?._id
      const { password } = req.body
      const { status, msg } = await this.Services.changePass({ password, myuser })
      return res.status(status).json(msg)
    }))

  }


}

export default new AuthRoutes(new TraderMiddleware(), new UserShopRepository()).router;