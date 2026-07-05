import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/hjem',           destination: '/' },
      { source: '/pensum',         destination: '/' },
      { source: '/priser',         destination: '/' },
      { source: '/spørsmål',       destination: '/' },
      { source: '/les',            destination: '/' },
      { source: '/les/b%C3%B8ker', destination: '/les/boker' },
      { source: '/les/bøker',      destination: '/les/boker' },
    ]
  },
}

export default nextConfig
