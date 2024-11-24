import z from "zod";

export const RegisterBody = z
  .object({
    // username: z.string().trim().min(2).max(256),
    username: z.string({required_error:"Tài khoản không được để trống."}).min(1, "Tài khoản không được để trống.").max(20, "Tài khoản không dài quá 20 kí tự."),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    fullname: z.string().trim().min(2).max(256),
    address: z
      .string()
      .trim()
      .min(2)
      .max(256)
      .optional(),
    phoneNumber: z
      .string()
      .trim()
      .min(2)
      .max(15)
      .optional(),
    confirmPassword: z.string().min(6).max(100).optional(),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });
export const Payment = z.object({
  name: z.string(),
  accountNumber: z.string(),
  expiryAt: z.string(),
});
export const RegisterPartnerBody = z.object({
  partner: RegisterBody,
  payment: Payment,
});
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;
export type RegisterPartnerBodyType = z.TypeOf<typeof RegisterPartnerBody>;

export const RegisterRes = z.object({
  data: z.object({
    token: z.string(),
    expiresAt: z.string(),
    name: z.string(),
    role: z.string(),
  }),
  message: z.string(),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
  .object({
    username: z.coerce.string({required_error:"Tài khoản không được để trống."}).min(1, "Tài khoản không được để trống.").max(20, "Tài khoản không dài quá 20 kí tự."),
    password: z.coerce.string({required_error:"Mật khẩu không được để trống."}).min(1, "Mật khẩu không được để trống.").max(20, "Mật khẩu không dài quá 20 kí tự."),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = RegisterRes;

export type LoginResType = z.TypeOf<typeof LoginRes>;
export const SlideSessionBody = z.object({}).strict();

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;
export const SlideSessionRes = RegisterRes;

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;
