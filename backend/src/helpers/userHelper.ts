
import crypto from "crypto";
import { mailTransporter } from "../middleware/confic";

export function generateResetCode(): string {
    return crypto.randomInt(100000, 999999).toString(); // 6 digits
}
export async function sendResetCodeEmail(
    to: string,
    code: string
) {
    await mailTransporter.sendMail({
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Password Reset Code",
        html: `
      <div style="font-family: Arial, sans-serif">
        <h2>Password Reset</h2>
        <p>Your reset code is:</p>
        <h1 style="letter-spacing:4px">${code}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
    });
}