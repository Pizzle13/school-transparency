/** @type {import('next').NextConfig} */
const nextConfig = {
  // Trailing slash consistency - set to false to use URLs without trailing slashes
  trailingSlash: false,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  }
}

module.exports = nextConfig