import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'

// Load .env.test before vitest runs
config({ path: '.env.test' })

export default defineConfig({
  test: {
    // Pass loaded environment variables to vitest
    env: {
      MONGO_URI: process.env.MONGO_URI,
      ENVIRONMENT: process.env.ENVIRONMENT,
      SHUFFLE_SECRET: process.env.SHUFFLE_SECRET,
      BASE_URL: process.env.BASE_URL,
      PORT: process.env.PORT,
    }
  }
})
