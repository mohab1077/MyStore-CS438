import express, { Request, Response, Router } from "express";

import asyncHandler from "../Errors/asyncHandler";
import { Authentication, TraderAndAdminLogin } from "../classes/Authentication";
import { SignUpMangment, TraderSignup } from "../classes/SignUpMangment";
import { EmailValidator, NameValidator, PhoneValidator } from "../Errors/validations";




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

  }
}

export default new AuthRoutes().router;