interface EnvironmentVariables {
  [key: string]: string | boolean | number | null;
}

declare global {
  interface Window {
    your_app_env?: EnvironmentVariables;
  }
}

interface StaticEnvironment {
  STATIC_PATH: string;

  BASE_URL: string | null;

  TEST_VAR: string;
}

type CompleteStaticEnvironment = StaticEnvironment;

const defaultEnv: CompleteStaticEnvironment = {
  STATIC_PATH: "/",

  BASE_URL: `${location.protocol}//${location.hostname}`,

  TEST_VAR: "This is a default in src/env.ts",
};

function parseEnv(value: any) {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  } else if (!isNaN(value) && !isNaN(parseFloat(value))) {
    return +value;
  } else {
    return value;
  }
}

const safeStaticVariables = Object.fromEntries(
  Object.entries(window.your_app_env || {}).map(([key, value]) => [key, parseEnv(value)]),
);

const env: CompleteStaticEnvironment = {...defaultEnv, ...safeStaticVariables};

export default env;
