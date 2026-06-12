import { codeModel } from "../modules/code";

export class CodeRepository {
  async createCode(
    code: string,
    email: string,
    expiresAt: Date
  ) {
    return await codeModel.create({
      code,
      email,
      expiresAt,
    });
  }

  async findLastCodeByEmail(email: string) {
    return await codeModel
      .findOne({ email })
      .sort({ createdAt: -1 });
  }
}