import z from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().min(1),
  VITE_NODE_ENV: z.string().min(1)
})

const parsed = envSchema.parse(import.meta.env)

export const env = {
  API_URL: parsed.VITE_API_URL,
  NODE_ENV: parsed.VITE_NODE_ENV
}
