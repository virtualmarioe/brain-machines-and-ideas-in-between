import type { NextConfig } from 'next';
const config: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  devIndicators: false,
  poweredByHeader: false,
  // Metadata is local and cheap; send it before interactive URL state can change.
  htmlLimitedBots: /.*/,
};
export default config;
