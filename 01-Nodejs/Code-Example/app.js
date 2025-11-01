const fs = require("fs/promises");

async function readFile() {
  try {
    const data = await fs.readFile("./text.txt", "utf8");
    console.log("File content:", data);
  } catch (err) {
    console.error("Error reading file:", err);
  }
}
readFile();
