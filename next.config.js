/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL || '',
    NEXT_PUBLIC_SOCKET_IO_URL: process.env.NEXT_PUBLIC_SOCKET_IO_URL || '',
    SOCKET_IO_SERVER_URL: process.env.SOCKET_IO_SERVER_URL || '',
    SOCKET_IO_AUTH_TOKEN: process.env.SOCKET_IO_AUTH_TOKEN || '',
  },
}

module.exports = nextConfig
