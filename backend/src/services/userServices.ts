import validator from "validator";
import { generateResetCode, sendResetCodeEmail } from "../helpers/userHelper";
import { UserShopRepository } from "../Repository/user";
import bcrypt from "bcrypt";
import { JwtService } from "../classes/Authentication";
import { CodeRepository } from "../Repository/code";
interface IGetInfo {
  myuser: string;
}

interface IPutInfo {
  myuser: string;
  email: string;
  phone: string;
}

interface ISendCode {
  email: string;
}

interface IConfirmCode {
  email: string;
  code: string;
}

interface IChangePass {
  myuser: any;
  password: string;
}

export class UserServices {
  private codeRepo: CodeRepository
  constructor(private UserRepo: UserShopRepository) {
    this.codeRepo = new CodeRepository()
  }

  async getinfo({ myuser }: IGetInfo) {
    const find = await this.UserRepo.findById(myuser);

    if (!find) {
      return {
        status: 400,
        msg: "user not found",
      };
    }

    const data = {
      name: find.name,
      phone: find.phone,
      email: find.email,
    };

    return {
      status: 200,
      msg: data,
    };
  }

  async putinfo({ myuser, email, phone }: IPutInfo) {
    const find = await this.UserRepo.findById(myuser);

    if (!find) {
      return {
        status: 400,
        msg: "user not found",
      };
    }

    find.email = email;
    find.phone = phone;

    await find.save();

    return {
      status: 200,
      msg: "Information updated successfully.",
    };
  }

  async SendCode({ email }: ISendCode) {
    const user = await this.UserRepo.findByEmail(email);

    if (!user) {
      return { status: 200, msg: "If the email exists, a code was sent." };
    }

    const code = generateResetCode();

    const hashedCode = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.codeRepo.createCode(hashedCode, email, expiresAt);

    await sendResetCodeEmail(email, code);

    return { status: 200, msg: "If the email exists, a code was sent." };
  }

  async ConfirmCode({ code, email }: IConfirmCode) {
    const finduser = await this.UserRepo.findByEmail(email);

    if (!finduser) {
      return { status: 401, msg: "wrong code" };
    }

    const find = await this.codeRepo.findLastCodeByEmail(email)

    if (!find) {
      return { status: 401, msg: "wrong code" };
    }

    const comp = await bcrypt.compare(code, find.code);

    if (!comp) {
      return { status: 401, msg: "wrong code" };
    }

    return { status: 200, msg: JwtService.sign({ email }), access: finduser.type };
  }

  async changePass({ password, myuser }: IChangePass) {
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return {
        status: 400,
        msg: "Password must contain uppercase, lowercase, number and symbol",
      };
    }

    const findUser = await this.UserRepo.findById(myuser);
    const hashpass = await bcrypt.hash(password, 10);

    if (!findUser) {
      return { status: 400, msg: "user not found" };
    }

    findUser.password = hashpass;
    await findUser.save();

    return { status: 200, msg: "password updated" };
  }
}