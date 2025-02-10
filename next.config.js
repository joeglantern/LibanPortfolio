/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Required for static site generation on Netlify
  images: {
    unoptimized: true, // Required for static site generation
  },
  trailingSlash: true, // Recommended for static site generation
}

module.exports = nextConfig 