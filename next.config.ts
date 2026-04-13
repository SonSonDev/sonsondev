import type { NextConfig } from 'next'
import path from 'path'

const envFile = path.resolve('./.env')
try {
  process.loadEnvFile(envFile)
} catch {
  // env file absent (ex: CI), les variables doivent être injectées autrement
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
}

export default nextConfig
