## 📦 **NVM & Node.js Version – Concise Notes**

### 🧠 **What is NVM?**

**NVM (Node Version Manager)** is a tool to:

- Install multiple Node.js versions
- Switch between versions easily
- Useful for testing apps across versions

---

### 💻 **NVM for Windows**

Use **nvm-windows**:
[https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

⚠️ It’s different from Linux/macOS NVM.

---

### 🛠️ **Install NVM (Windows)**

1. Download `.exe` from GitHub release page
2. Install it
3. It sets up Node.js versions in a managed folder

---

### 📥 **Install Node.js using NVM**

```bash
nvm install 20.12.2      # Install specific version
nvm install lts          # Install latest LTS
nvm list available       # See all versions
```

---

### 🔄 **Switch Between Node Versions**

```bash
nvm use 20.12.2          # Use a specific version
nvm list                 # List installed versions
```

---

### 🧹 **Uninstall Node Version**

```bash
nvm uninstall 18.16.1
```

---

### 🧪 **Check Installed Version**

```bash
node -v     # Check Node.js version
npm -v      # Check npm version
```

---

### 🔁 **Use Cases**

- Testing compatibility
- Using LTS for stable projects
- Trying latest features in Current version

---

### 🛑 **Important Notes**

- Don’t install Node.js manually if using NVM
- NVM manages both `node` and `npm`
- Always install global packages per version (they don’t share)

---
