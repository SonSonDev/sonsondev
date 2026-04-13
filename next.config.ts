import type { NextConfig } from 'next'
import path from 'path'

const envFile = path.resolve('./.env')
try {
  process.loadEnvFile(envFile)
} catch {
  // env file absent (ex: CI), les variables doivent être injectées autrement
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'www.gstatic.com' },
    ],
  },
}

export default nextConfig
