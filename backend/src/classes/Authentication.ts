import jwt from "jsonwebtoken";
import { usermodel } from "../modules/user";
import bcrypt from "bcrypt";
import { UserShopRepository } from "../Repository/user";

type UserRole = "admin" | "trader"  // add the user 

interface LoginByemail {
  email: string;
  password: string;
}

interface LoginResponse {
  msg: string;
  access?: UserRole;
  status : number ;
}

class JwtService {
  static sign(data: object): string {
    return jwt.sign(
      data,
      process.env.jwtpass || ""
    );
  }
}
interface IAuthentication {
  login(data: LoginData): Promise<LoginResponse>;
}

export class TraderAndAdminLogin implements IAuthentication {
 

  async login(data: LoginByemail): Promise<LoginResponse> {
     const loginRepo = new UserShopRepository()
     const finduser = await loginRepo.login(data.email);

    if (!finduser) {
        return { msg: "The password or email is incorrect", status: 400 };
    }

    const pass = await bcrypt.compare(data.password, finduser.password)
    if (!pass) {
        return { msg: "The password or email is incorrect", status: 400 };
    }

    return {
      msg: JwtService.sign({email:data.email}),
      access: finduser.type,
      status : 200,
    };
  }
}


// add more users for login 

type LoginData = LoginByemail // add more types if theres another login method with union 

export class Authentication {
  constructor(
    private strategy: IAuthentication
  ) {}

  async login(
    data: LoginData
  ): Promise<LoginResponse> {

    return this.strategy.login(data);
  }

 
}