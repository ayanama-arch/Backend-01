import http from "http";

const server = http.createServer((req, res, next) => {
  res.end("Hello from HTTP Module");
});

server.listen(3000);
