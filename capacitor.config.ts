import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Change before Play Console upload if you need a different applicationId.
  appId: "io.refuah.app",
  appName: "Refuah",
  webDir: "dist",
};

// Live reload: CAP_SERVER_URL=http://YOUR_LAN_IP:8080 npx cap run android
if (process.env.CAP_SERVER_URL) {
  config.server = {
    url: process.env.CAP_SERVER_URL,
    cleartext: true,
  };
}

export default config;
