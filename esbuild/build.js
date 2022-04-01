import {build} from "esbuild";

import {createBuildConfig, createAssets} from "./config.js";

try {
  const buildConfig = createBuildConfig({production: true});
  const result = await build(buildConfig);

  result.errors.forEach(console.error);
  result.warnings.forEach(console.warn);

  await createAssets(buildConfig, result);
} catch (err) {
  console.error(err);
}
