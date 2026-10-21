import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The docs live inside the library repo, which has its own yarn lockfile.
  // Pin the root here so Next does not treat the library as the workspace.
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingRoot: path.resolve(__dirname),
  // Let `next dev` serve its scripts to devices on the local network (e.g.
  // opening http://192.168.x.x:3000 from a phone). Without this the page
  // renders but never hydrates, so buttons like the theme toggle do nothing.
  allowedDevOrigins: ['192.168.*.*'],
};

export default nextConfig;
