import { z } from "zod";

export const EmailValidator = z
  .string()
  .email("Invalid email");

export const PhoneValidator = z
  .string()
  .regex(/^(091|092|093|094)\d{7}$/, "Invalid phone number");

export const NameValidator = z
  .string()
  .min(2, "Name too short")
  .max(50, "Name too long")
  .regex(/^[A-Za-z\u0600-\u06FF\s]+$/, "Name must contain letters only");

export const ShopNameValidator = z
  .string()
  .trim()
  .min(2, "Shop name too short")
  .max(80, "Shop name too long");

  export const LogoValidator = z
  .string()
  .refine(
    (v) =>
      v === "" ||
      /\/uploads\/.+\.(jpg|jpeg|png|webp)$/i.test(v),
    {
      message: "Invalid logo path",
    }
  );


export const DescriptionValidator = z
  .string()
  .trim()
  .max(500, "Description must not exceed 500 characters");


export const PageValidator = z.coerce
  .number()
  .int()
  .min(1, "Page must be greater than or equal to 1");

export const CategoryValidator = z
  .array(
    z.string().trim().min(3).max(30)
  )
  .max(50, "Maximum 50 categories allowed");

