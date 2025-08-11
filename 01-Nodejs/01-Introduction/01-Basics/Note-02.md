# Introduction to command line

**Prompt**
The text when you open terminal application called prompt.
eg: `01-Introduction (master) ➜`

**Command Line**
The line where you start typing in terminal application called command line.

**Terminal**
Terminal is whole application which can execute command to the computer.

**GUI**
It is application which is user friendly which executes command through this application

Sure Boss! Here's a basic list of **Linux terminal commands** — great for using WSL (Windows Subsystem for Linux) or any real Linux environment.

---

## 🖥️ **Basic Linux Terminal Commands**

### 📂 **1. Navigating the File System**

| Command         | Description                                   |
| --------------- | --------------------------------------------- |
| `ls`            | Lists files and directories.                  |
| `ls -l`         | Lists with details (permissions, size, etc.). |
| `cd foldername` | Change into a directory.                      |
| `cd ..`         | Go up one directory.                          |
| `cd ~`          | Go to your home directory.                    |
| `pwd`           | Print current directory path.                 |

---

### 📁 **2. File & Folder Operations**

| Command            | Description                                   |
| ------------------ | --------------------------------------------- |
| `mkdir foldername` | Create a directory.                           |
| `rmdir foldername` | Remove an **empty** directory.                |
| `rm filename`      | Remove a file.                                |
| `rm -r foldername` | Remove a folder and all contents (recursive). |
| `cp file1 file2`   | Copy file1 to file2.                          |
| `mv file1 path/`   | Move or rename a file.                        |

---

### 📃 **3. Viewing Files**

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `cat file.txt`  | View contents of a file.                     |
| `less file.txt` | View file one screen at a time (scrollable). |
| `head file.txt` | Show first 10 lines of file.                 |
| `tail file.txt` | Show last 10 lines.                          |
| `nano file.txt` | Open file in Nano editor.                    |
| `vim file.txt`  | Open file in Vim editor (advanced).          |

---

### ⚙️ **4. System Info**

| Command    | Description                                    |
| ---------- | ---------------------------------------------- |
| `uname -a` | Show Linux version & system info.              |
| `top`      | Real-time process monitor (like Task Manager). |
| `htop`     | Improved `top` (needs installation).           |
| `whoami`   | Show current username.                         |
| `df -h`    | Disk space usage.                              |
| `free -h`  | RAM usage.                                     |

---

### 🛠️ **5. Node.js Related (after install)**

| Command         | Description                      |
| --------------- | -------------------------------- |
| `node -v`       | Show Node.js version.            |
| `npm -v`        | Show npm version.                |
| `nvm list`      | List installed Node.js versions. |
| `nvm use x.x.x` | Use a specific version of Node.  |
| `which node`    | Path to Node.js binary.          |

---

### 🔧 **6. Package Management**

(Debian/Ubuntu-based)

| Command                      | Description                           |
| ---------------------------- | ------------------------------------- |
| `sudo apt update`            | Update available packages.            |
| `sudo apt upgrade`           | Upgrade installed packages.           |
| `sudo apt install nodejs`    | Install Node.js (alternative to nvm). |
| `sudo apt install <package>` | Install any package.                  |

---

### 🧼 **7. Cleaning Up**

| Command    | Description                      |
| ---------- | -------------------------------- |
| `clear`    | Clears the terminal screen.      |
| `history`  | Shows command history.           |
| `ctrl + c` | Stops a running command/process. |

---
