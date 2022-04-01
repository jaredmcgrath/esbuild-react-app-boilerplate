import {createServer, request} from "http";

export default (result) => {
  const {host, port} = result;

  // TODO: Define this, or it defaults to 3000
  const proxyPort = process.env.DEV_PORT || 3000;

  console.log(`Fowarding proxy listening on ${proxyPort}`);

  createServer((req, res) => {
    console.log("proxy: " + req.url);

    const options = {
      hostname: host,
      port: port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    // TODO: You'll need to play around with this
    // Current: forward index.html for anything that isn't /js* or /assets*
    if (!(req.url.startsWith("/js") || req.url.startsWith("/assets"))) {
      options.path = "/index.html";
    }

    const proxyReq = request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, {end: true});
    });

    req.pipe(proxyReq, {end: true});
  }).listen(proxyPort);
};
