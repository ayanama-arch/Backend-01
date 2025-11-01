const { Buffer } = require("node:buffer");
// ============================================
// NODE.JS BUFFER EXERCISES
// ============================================
// Complete each exercise by replacing the TODO comments with your code
// Run with: node buffer-exercises.js

console.log("=== EXERCISE 1: Creating Buffers ===");
// TODO: Create a buffer from the string "Hello Buffer"
// TODO: Create a buffer of size 10, filled with zeros
// TODO: Create a buffer from an array [72, 101, 108, 108, 111]

// Your code here:
// const buf1 = Buffer.from("Hello Buffer");
// const buf2 = Buffer.alloc(10);
// const buf3 = Buffer.from([72, 101, 108, 108, 111]);

// Uncomment to test:
// console.log("Buffer from string:", buf1);
// console.log("Allocated buffer:", buf2);
// console.log("Buffer from array:", buf3);

console.log("\n=== EXERCISE 2: String Conversions ===");
// TODO: Create a buffer from "Node.js" and convert it to:
// - A hex string
// - A base64 string
// - Back to a UTF-8 string

// Your code here:
// const textBuf = Buffer.from("Node.js");
// const hexString = textBuf.toString("hex");
// const base64String = textBuf.toString("base64");
// const utf8String = textBuf.toString("utf-8");

// Uncomment to test:
// console.log("Hex:", hexString);
// console.log("Base64:", base64String);
// console.log("UTF-8:", utf8String);

console.log("\n=== EXERCISE 3: Writing Numbers ===");
// TODO: Create a buffer of size 8
// TODO: Write the number 255 at position 0 (as UInt8)
// TODO: Write the number 1000 at position 2 (as UInt16BE)
// TODO: Write the number 50000 at position 4 (as UInt32LE)

// Your code here:
// const numBuf = Buffer.alloc(8);
// Write your numbers here
// numBuf.writeUInt8(255, 0);
// numBuf.writeUint16BE(1000, 2);
// numBuf.writeUInt32LE(50000, 4);

// Uncomment to test:
// console.log("Buffer with numbers:", numBuf);

console.log("\n=== EXERCISE 4: Reading Numbers ===");
// Given this buffer, read the numbers stored in it
const dataBuf = Buffer.from([0x00, 0x01, 0xff, 0x00, 0x10, 0x20, 0x30, 0x40]);

// TODO: Read byte at position 0 as UInt8
// TODO: Read bytes at position 2-3 as UInt16BE
// TODO: Read bytes at position 4-7 as UInt32BE

// Your code here:
// const byte0 = dataBuf.readUInt8(0);
// const short = dataBuf.readUInt16BE(2);
// const int = dataBuf.readUInt32BE(4);

// Uncomment to test:
// console.log("Byte at 0:", byte0);
// console.log("UInt16 at 2:", short);
// console.log("UInt32 at 4:", int);

console.log("\n=== EXERCISE 5: Slicing and Copying ===");
const original = Buffer.from("JavaScript Buffer Operations");

// TODO: Create a slice from index 0 to 10
// TODO: Create a NEW buffer and copy bytes 11-17 from original into it

// Your code here:
// const sliced = original.slice(0, 10);
// const copied = Buffer.alloc(7);
// original.copy(copied, 0, 11, 18);

// Uncomment to test:
// console.log("Sliced:", sliced.toString());
// console.log("Copied:", copied.toString());
// console.log("Modifying slice affects original?");
// sliced[0] = 88;
// console.log("Original:", original.toString());

console.log("\n=== EXERCISE 6: Buffer Concatenation ===");
const part1 = Buffer.from("Hello");
const part2 = Buffer.from(" ");
const part3 = Buffer.from("World");

// TODO: Concatenate these three buffers into one
// TODO: Print the result as a string

// Your code here:
// const combined = Buffer.concat([part1, part2, part3]);

// Uncomment to test:
// console.log("Combined:", combined.toString());

console.log("\n=== EXERCISE 7: Comparing Buffers ===");
const buf_a = Buffer.from("abc");
const buf_b = Buffer.from("abc");
const buf_c = Buffer.from("abd");

// TODO: Check if buf_a equals buf_b
// TODO: Compare buf_a with buf_c (should return negative number)

// Your code here:
// const areEqual = buf_a.equals(buf_b);
// const comparison = buf_a.compare(buf_c);

// Uncomment to test:
// console.log("buf_a equals buf_b:", areEqual);
// console.log("buf_a compare buf_c:", comparison);

console.log("\n=== CHALLENGE: Binary Protocol Parser ===");
// You receive a binary message with this structure:
// Bytes 0-3: Message ID (UInt32BE)
// Bytes 4-5: Message Length (UInt16BE)
// Bytes 6-7: Flags (UInt16LE)
// Bytes 8+: Payload (UTF-8 string)

const binaryMessage = Buffer.from([
  0x00,
  0x00,
  0x10,
  0x20, // Message ID: 4128
  0x00,
  0x05, // Length: 5
  0x01,
  0x00, // Flags: 1
  0x48,
  0x65,
  0x6c,
  0x6c,
  0x6f, // "Hello"
]);

// TODO: Parse this message and extract:
// - messageId
// - length
// - flags
// - payload (as string)

// Your code here:
function parseMessage(buf) {
  const messageId = binaryMessage.readUint32BE(0);
  const length = binaryMessage.readUint16BE(4);
  const flags = binaryMessage.readUint16LE(6);
  const payload = binaryMessage.toString("utf8", 8);

  return { messageId, length, flags, payload };
}

// Uncomment to test:
console.log("Parsed message:", parseMessage(binaryMessage));

console.log("\n=== CHALLENGE: Binary Protocol Builder ===");
// TODO: Create a function that builds a binary message with the format above
// TODO: Test it by creating a message with ID=5000, flags=3, payload="Test"

// Your code here:
function buildMessage(messageId, flags, payload) {
  const payloadBuf = Buffer.from(payload, "utf8");
  const length = payloadBuf.length;

  // Total size = 4 (messageId) + 2 (length) + 2 (flags) + payload
  const buf = Buffer.alloc(4 + 2 + 2 + length);

  // Write message ID (UInt32BE) at bytes 0-3
  buf.writeUInt32BE(messageId, 0);

  // Write length (UInt16BE) at bytes 4-5
  buf.writeUInt16BE(length, 4);

  // Write flags (UInt16LE) at bytes 6-7
  buf.writeUInt16LE(flags, 6);

  // Write payload starting at byte 8
  payloadBuf.copy(buf, 8);

  return buf;
}

// Uncomment to test:
const myMessage = buildMessage(5000, 3, "Test");
console.log("Built message:", myMessage);
console.log("Parsed back:", parseMessage(myMessage));

// 🛑 TOBE CONTINUED
console.log("\n=== ADVANCED: Hexdump Generator ===");
// TODO: Create a function that displays a buffer in hexdump format
// Format: "OFFSET  HEX                              ASCII"
// Example: "0000    48 65 6c 6c 6f 20 57 6f 72 6c 64  Hello World"

function hexdump(buf) {
  const bytesPerLine = 16;

  for (let offset = 0; offset < buf.length; offset += bytesPerLine) {
    // Slice a line of up to 16 bytes
    const line = buf.slice(offset, offset + bytesPerLine);

    // Hex representation
    const hex = Array.from(line)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");

    // ASCII representation: printable chars, else '.'
    const ascii = Array.from(line)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : "."))
      .join("");

    // Print offset, hex, and ASCII
    console.log(
      offset.toString(16).padStart(4, "0"),
      "  ",
      hex.padEnd(bytesPerLine * 3),
      " ",
      ascii
    );
  }
}

// Uncomment to test:
const testBuf = Buffer.from("Hello World! This is a buffer hexdump example.");
hexdump(testBuf);
