import { usermodel } from "../modules/user";
import bcrypt from "bcrypt";
import validator from "validator";
import { UserShopRepository } from "../Repository/user";

type UserRole = "trader" | "customer" // add the user 

interface Signup {
   name: string;
    email: string;
    password: string;
    phone: string;
}

interface LoginResponse {
  msg: string;
  access?: UserRole;
  status : number ;
}


interface IAuthentication {
  Signup(data: signData): Promise<LoginResponse>;
}

export class TraderSignup implements IAuthentication {
 

  async Signup({ email, password, phone, name }: Signup): Promise<LoginResponse> {
     const registerRepo = new UserShopRepository()
      const find = await registerRepo.findByEmail(email);

    if (find) {
        return {
            status: 400,
            msg: "This email is already registered. Please try another email"
        };
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        return {
            status: 400,
            msg: "Password must contain uppercase, lowercase, number and symbol"
        };
    }
    const hashpass = await bcrypt.hash(password, 10);
    await registerRepo.createTrader({
    email,
    password: hashpass,
    phone,
    name,
  });
    return {
        status: 200,
        msg: "You have been signed up successfully"
    };
  }
}


// add more users for login 

type signData = Signup // add more types if theres another login method with union 

export class SignUpMangment  {
  constructor(
    private strategy: IAuthentication
  ) {}

  async Signup(
    data: signData
  ): Promise<LoginResponse> {

    return this.strategy.Signup(data);
  }

 
}