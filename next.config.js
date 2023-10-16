/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Indicate that these packages should not be bundled by webpack
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
}

module.exports = nextConfig
