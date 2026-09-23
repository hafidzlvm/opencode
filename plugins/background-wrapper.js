// background-wrapper — local V2-compatible wrapper for @zenobius/opencode-background.
//
// Upstream only ships V1 format (named export BackgroundProcesssPlugin,
// no default export), which OpenCode v2 rejects with:
// "Plugin must export a default definition with an id and an effect or
// setup function (Missing key at [default])".
// Pattern sama seperti ponytail-v2.js / ecc-hooks.ts / graphify.js:
// re-export V1 fn sebagai server() (V1-compat path) + default { id, server, setup }.
import { BackgroundProcesssPlugin } from "@zenobius/opencode-background";

export const BackgroundWrapperPlugin = BackgroundProcesssPlugin;

async function setup(_ctx) {
  // V2 host reads default.setup; hooks/tools live in server() (V1-compat path).
  return;
}

export default {
  id: "background",
  server: BackgroundWrapperPlugin,
  setup,
};
