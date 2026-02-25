import withPWA from "@ducanh2912/next-pwa";

const withPWAConfig = withPWA({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swMinify: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        disableDevLogs: true,
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    turbopack: {}, // Explicity disable/configure turbopack checks for Next 16 plugin compatibility
};

export default withPWAConfig(nextConfig);
