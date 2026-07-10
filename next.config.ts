import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  webpack(config, { isServer, webpack }) {
    if (isServer) {
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        "transactionsRemote/TransactionsFeature": path.resolve(
          __dirname,
          "app/components/transactions/TransactionsFeature.tsx"
        ),
      };
    } else {
      config.output.environment = {
        ...(config.output.environment ?? {}),
        asyncFunction: true,
      };
      config.plugins.push(
        new webpack.container.ModuleFederationPlugin({
          name: "financeShell",
          remotes: {
            transactionsRemote:
              "transactionsRemote@http://localhost:3001/_next/static/chunks/remoteEntry.js",
          },
        })
      );
    }

    return config;
  },
};

export default nextConfig;
