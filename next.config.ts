import type { NextConfig } from 'next'
import path from 'path'

const envFile = path.resolve('./.env')
try {
  process.loadEnvFile(envFile)
} catch {
  // env file absent (ex: CI), les variables doivent être injectées autrement
}

const nextConfig: NextConfig = {
  output: 'export',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack: (config: any) => {
    config.module!.rules!.push({
      test: /\.ya?ml$/,
      use: [{ loader: path.resolve('./yaml-loader.cjs') }],
    })
    return config
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'www.gstatic.com' },
    ],
  },
}

export default nextConfig
