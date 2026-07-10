import type { NextConfig } from "next";
import path from "node:path";

const transactionsRemoteUrl = (
  process.env.NEXT_PUBLIC_TRANSACTIONS_REMOTE_URL ?? "http://127.0.0.1:3001"
).replace(/\/$/, "");

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
              `transactionsRemote@${transactionsRemoteUrl}/_next/static/chunks/remoteEntry.js`,
          },
        })
      );
    }

    return config;
  },
};

export default nextConfig;
