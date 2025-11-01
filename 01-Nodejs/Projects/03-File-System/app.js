const fs = require("node:fs/promises");

(async () => {
  try {
    const fileHandler = await fs.open("./command.txt", "r");
  } catch (error) {
    console.log(error);
  }
})();
