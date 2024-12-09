export default {
  reactStrictMode: false,
  images: {
    domains: [
      "localhost",
      "testapi.onlinecollegenotes.com",
      "merorealstateapi.ism.com.np",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5077",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "testapi.onlinecollegenotes.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "merorealstateapi.ism.com.np",
        pathname: "/**",
      },
    ],
  },
};
