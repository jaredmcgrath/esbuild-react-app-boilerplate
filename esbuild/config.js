// Node imports
import fs from "fs";
import fse from "fs-extra";

// esbuild plugins
import manifestPlugin from "esbuild-plugin-manifest";
import svgrPlugin from "esbuild-plugin-svgr";
import {EsbuildPlugin as typescriptCheckerPlugin} from "vite-esbuild-typescript-checker";

// env var imports
import dotenv from "dotenv";
import envsub from "envsub";

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    year: "numeric",
    hour12: false,
    timeZoneName: "short",
    timeZone: "America/Toronto",
  });
}

export function createBuildConfig(options) {
  const buildDate = formatDate(new Date().getTime());

  const buildConfig = {
    // TODO: Change if not using typescript
    entryPoints: ["src/index.tsx"],
    bundle: true,
    minify: options.production === true,
    sourcemap: true,
    metafile: true,
    target: ["chrome58", "firefox57", "safari11", "edge18"],
    define: {
      // TODO: Add more (static) environment variables if you want
      "process.env.NODE_ENV": options.production ? '"production"' : '"development"',
      "process.env.BUILD_DATE": `"${buildDate}"`,
    },
    outdir: "dist/js",
    plugins: [
      svgrPlugin({
        icon: true,
        ref: true,
      }),
      // TODO: Change if not using typescript
      typescriptCheckerPlugin({
        checker: {
          typescript: {
            configFile: "./tsconfig.json",
          },
        },
      }),
    ],
  };

  if (options.production) {
    buildConfig.plugins.push(manifestPlugin({}));
  }

  return buildConfig;
}

export function createServeConfig() {
  return {
    servedir: "dist",
    onRequest: (req) => {
      console.log(" internal: " + req.path);
    },
  };
}

export async function createAssets(buildConfig, buildResult) {
  // TODO: Change if your static assets are elsewhere
  await fse.copy("src/assets", "dist/assets", {overwrite: true});

  let templateEnv = [];

  if (buildConfig && buildResult) {
    // This searches the compiled output for the input file with name 'src/index.tsx' to inject the right path
    // to load the JS for your compiled react app
    var scripts = Object.entries(buildResult.metafile.outputs)
      // TODO: Rename if needed
      .filter(([_, value]) => value.entryPoint == "src/index.tsx")
      .map(([key, _]) => key);

    let scriptFile = scripts[0];
    scriptFile = scriptFile.replace(buildConfig.outdir, "${REACT_APP_STATIC_PATH}js");

    templateEnv = [{name: "SCRIPT_PATH", value: scriptFile}];
  } else {
    // TODO: You should create a .env file for values injected into the build process and/or react app
    if (!fs.existsSync(".env")) {
      // Will default to 'example.env' if .env doesn't exist
      console.warn("'.env' file does not exist, copying 'example.env' to '.env'");
      await fs.promises.copyFile("example.env", ".env");
    }

    dotenv.config();

    let staticVariableObject = {};

    // Find and inject env vars
    for (let key in process.env) {
      // Only inject env variables that start with REACT_APP_
      if (!key.startsWith("REACT_APP_")) continue;

      // Cut out the 'REACT_APP_' part
      const varKey = key.substring(10);
      staticVariableObject[varKey] = process.env[key];
    }

    templateEnv = [
      {name: "REACT_APP_STATIC_PATH", value: "/"},
      {name: "REACT_APP_STATIC_VARIABLE_OBJECT", value: JSON.stringify(staticVariableObject)},
      {name: "SCRIPT_PATH", value: "/js/index.js"},
    ];
  }

  await envsub({
    templateFile: "src/index.html.template",
    outputFile: buildResult ? "dist/index.html.template" : "dist/index.html",
    options: {envs: templateEnv, system: true, protect: true},
  });
}
