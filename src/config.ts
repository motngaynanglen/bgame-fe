import { z } from 'zod'
const env = process.env.NODE_ENV;

const configSchema = z.object({
  NEXT_API_ENDPOINT: z.string(),
  NEXT_URL: z.string()
})

const configProject = configSchema.safeParse({
  NEXT_API_ENDPOINT: (env == "development") ? process.env.NEXT_DEVELOPMENT_API_ENDPOINT : process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_URL: (env == "development") ? process.env.NEXT_DEVELOPMENT_URL : process.env.NEXT_PUBLIC_URL
})

if (!configProject.success) {
  console.error(configProject.error.issues)
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}

const envConfig = configProject.data
export default envConfig