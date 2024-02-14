/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'img.clerk.com',
            pathname: '**',
          },
          {
            protocol: 'https',
            hostname: 'freelogopng.com',
            pathname: '**',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            pathname: '**',
          },
          
        ],
      }
};

export default nextConfig;
// domains:[
//     "img.clerk.com",
//     "localhost"
// ]