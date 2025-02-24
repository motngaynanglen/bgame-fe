// import z from "zod";
// export const RegisterBody = z
//   .object({
//     // username: z.string().trim().min(2).max(256),
//     boardgameName: z.string(),
//     publisher: z.string(),
//     tags: z.string(),
//     fullname: z.string().trim().min(2, "Tên không được dưới 2 kí tự.").max(50, "Tên không dài quá 50 kí tự."),
//     phoneNumber: z.string().regex(phoneRegex, "Không đúng định dạng số điện thoại").optional(),
//     confirmPassword: z.string().min(6).max(100).optional(),
//   })
//   .strict()
//   .superRefine(({ confirmPassword, password }, ctx) => {
//     if (confirmPassword !== password) {
//       ctx.addIssue({
//         code: "custom",
//         message: "Mật khẩu không khớp",
//         path: ["confirmPassword"],
//       });
//     }
//   });