import z, { any, date } from 'zod'

export const MessageRes = z
  .object({
    message: z.string()
  })
  .strict()

export type MessageResType = z.TypeOf<typeof MessageRes>

export const IsSucceedRes = z.object({
  isSucceed: z.boolean()
}).strict()

export const CommonRes = z
  .object({
    message: z.string(),
    data: z.any()
  })
  .strict()
export type CommonResType = z.TypeOf<typeof CommonRes>

export const AdminDashboardCardRes = z.object({
  message: z.string(),
  data: z.object({
    users: z.coerce.number(),
    partners: z.coerce.number(),
    careCenters: z.coerce.number(),
    invoices: z.coerce.number(),
  })
}).strict()
export type AdminDashboardCardResType = z.TypeOf<typeof AdminDashboardCardRes>

export const PartnerDashboardCardRes = z.object({
  message: z.string(),
  data: z.object({
    careCenters: z.coerce.number(),
    orders: z.coerce.number(),
    customers: z.coerce.number(),
    usingPackages: z.coerce.number(),
  })
}).strict()
export type PartnerDashboardCardResType = z.TypeOf<typeof PartnerDashboardCardRes>