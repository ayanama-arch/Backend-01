### 1. **Introduction**

This section likely gives an overview of what you'll be learning, the importance of Node.js in development, and what tools you'll be installing to create a productive environment.

### 2. **Terminal**

- **Shortcuts**: Learn useful keyboard shortcuts to improve terminal navigation.
- **Finding CPU Architecture**: Check if your system is 64-bit or 32-bit, as some installations depend on architecture.

  - Command: `echo %PROCESSOR_ARCHITECTURE%` (Windows)

---

### 3. **Browser**

- **Edge & Chrome**: Recommended browsers for web development.
- **DevTools**: Inspect HTML, CSS, and monitor API requests (Network tab).

  - Shortcut: `F12` or `Ctrl+Shift+I` to open Developer Tools.

---

### 4. **Code Editor**

- **VS Code**: Lightweight, powerful IDE for JavaScript/Node.js.
- **Material Theme, Prettier**: Install extensions to improve code readability and formatting.
- **Code Command**: Allows you to open files/folders in VS Code from terminal using `code .`.

---

### 5. **NVM-Windows & Node.js**

- **NVM (Node Version Manager)**: Tool to manage multiple Node.js versions on Windows.
- **Installing Node.js LTS**: Use NVM to install the Long-Term Support (LTS) version of Node.

  - Commands:

    - `nvm install lts`
    - `nvm use <version>`

---

### 6. **Postman**

API testing tool.

- Test REST APIs you create with Node.js.
- Send GET, POST, PUT, DELETE requests easily and see responses.

---

### 7. **Wireshark**

Network protocol analyzer.

- Helps monitor and analyze traffic between your app and the internet.
- Useful for learning how requests/responses work under the hood.

---

### 8. **Task Manager**

- Monitor system performance and process usage.
- Useful to check if Node.js apps are consuming too much CPU/memory.
- Shortcut: `Ctrl + Shift + Esc`

---

### 9. **Programmer's Calculator**

- Offers conversions between binary, decimal, hexadecimal.
- Helps when working with bitwise operations or network-level data.

---

### 10. **Hello, World!**

- Your first Node.js app.
- Typically involves creating a small HTTP server or logging a message.

```js
console.log("Hello, World!");
```

or using a basic HTTP server:

```js
const http = require("http");
http
  .createServer((req, res) => {
    res.end("Hello, World!");
  })
  .listen(3000);
```

---
