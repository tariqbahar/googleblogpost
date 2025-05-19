/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "example.com"], // 👈 Add this line
  },
  async rewrites() {
    return [
      {
        source: "/rss.xml",
        destination: "/api/rss",
      },
    ];
  },
};

module.exports = nextConfig;
