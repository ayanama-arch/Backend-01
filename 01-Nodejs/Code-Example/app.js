// Nodejs has three different ways of doing same things
// 1. Promise API
// 2. Callback API
// 3. Synchronous API

// Generally use promise API for normally
// Callback when performance intensive task faster than promise.
// Use synchronous API ony when your'e sure about using it.
const fs = require("fs");

fs.watch("./text.txt", (eventtype, fileName) => {
  console.log(eventtype);
  console.log(fileName);
});
