import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'tools.applemediaservices.com',
    //   },
    //   // lh3.googleusercontent.com
    //   {
    //     protocol: 'https',
    //     hostname: 'lh3.googleusercontent.com',
    //   },
    //   // play.google.com
    //   {
    //     protocol: 'https',
    //     hostname: 'play.google.com',
    //   },
    //   // play.google.com
    //   {
    //     protocol: 'https',
    //     hostname: 'play.google.com',
    //   },
    //   // (http://127.0.0.1:8000/storage/media/e6c3dd630428fd54834172b8fd2735fed9416da4/test.png)
    //   {
    //     protocol: 'http',
    //     hostname: '127.0.0.1:8000',
    //   }

    // ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
