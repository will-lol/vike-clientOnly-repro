import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import vikePhoton from "vike-photon/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  title: "My Vike App",
  description: "Demo showcasing Vike",
  ssr: true,

  extends: [vikeReact, vikePhoton],
} satisfies Config;
