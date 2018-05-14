const express = require("express");
const app = express();

const appConfig = require("./boot/main.js");
const routeConfig = require("./config/routes.js");
const http = require("http");

const port = normalizePort(process.env.PORT);

appConfig.init(app, express);
routeConfig.init(app);

app.set('port', port);

const server = http.createServer(app);

server.listen(port);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

server.on("listening", () => {
  console.log(`server is listening for requests on port ${server.address().port}`);
});