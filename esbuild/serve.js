import {serve} from "esbuild";

import {createBuildConfig, createServeConfig, createAssets} from "./config.js";
import devProxyHandler from "./devProxyHandler.js";

try {
  const buildConfig = createBuildConfig({production: false});
  const serveConfig = createServeConfig();
  const result = await serve(serveConfig, buildConfig);
  await createAssets();

  devProxyHandler(result);
} catch (err) {
  console.error(err);
}
