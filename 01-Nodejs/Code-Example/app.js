const fs = require("fs/promises");

(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open("./text.txt", "w");

  const stream = fileHandle.createWriteStream();

  // Size of Stream Buffer
  console.log(stream.writableHighWaterMark);

  const buff = Buffer.from("string");

  // stream.write() returns boolean value whether buffer is full or not
  stream.write(buff);

  // Filled value of stream buffer
  console.log(stream.writableLength);
  console.timeEnd("writeMany");
})();
