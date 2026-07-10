import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  webpack(config, { isServer, webpack }) {
    if (!isServer) {
      config.plugins.push(
        new webpack.container.ModuleFederationPlugin({
          name: "transactionsRemote",
          filename: "static/chunks/remoteEntry.js",
          exposes: {
            "./TransactionsFeature": "./app/remote/TransactionsFeature.tsx",
          },
        })
      );
    }

    return config;
  },
};

export default nextConfig;
