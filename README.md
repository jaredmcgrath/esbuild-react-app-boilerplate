# esbuild boilerplate

Tested on Node 14.x, 16.x

setup: `npm i`

Start dev server: `npm start` or `npm run start`

Make build: `npm run build`

Serving build requires:

- npm `serve` package installed: `npm i -g serve`
- `jq` command line utility [here](https://stedolan.github.io/jq/download/)
  - MacOS: `brew install jq`
  - Linux: ...

Run (production mode, linux/mac only): `./entrypoint.sh`
