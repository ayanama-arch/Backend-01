const net = require("net");

const client = net.createConnection({ host: "127.0.0.1", port: 3008 }, () => {
  console.log("Connected to the server!");
});

client.on("end", () => {
  console.log("Connection was ended!");
});
