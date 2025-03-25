"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextConfig = {
/* config options here */
};

// Replace the require with dynamic import
(async () => {
  const { initOpenNextCloudflareForDev } = await import('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
})().catch(console.error);

module.exports = nextConfig;
