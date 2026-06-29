import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/hjem',      destination: '/' },
      { source: '/pensum',    destination: '/' },
      { source: '/priser',    destination: '/' },
      { source: '/spørsmål',  destination: '/' },
    ]
  },
}

export default nextConfig
