import z from "zod";
export const BoardGameBody = z
    .object({
        // username: z.string().trim().min(2).max(256),
        id: z.string().optional(),
        code: z.string().optional(),
        productName: z.string(),
        image: z.string(),
        description: z.string(),
        rentPrice: z.string().optional(),
        price: z.string().optional(),
        condition: z.string().optional(),
        publisher: z.string(),
        tags: z.string().array(),
    });
    export type BoardGameBodyType = z.TypeOf<typeof BoardGameBody>