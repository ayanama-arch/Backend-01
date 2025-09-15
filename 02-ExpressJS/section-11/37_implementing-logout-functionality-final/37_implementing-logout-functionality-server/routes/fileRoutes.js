import express from "express";
import { createWriteStream } from "fs";
import { rm, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import directoriesData from "../directoriesDB.json" with { type: "json" };
import filesData from "../filesDB.json" with { type: "json" };
import { validateUUID } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.param("id", validateUUID("id"));
router.param("parentDirId", validateUUID("parentDirId"));

router.param("parentDirId", (req, res, next, parentDirId) => {
  console.log({ method: req.method, parentDirId });
  next();
});

router.post("/:parentDirId?", (req, res, next) => {
  const parentDirId = req.params.parentDirId || req.user.rootDirId;
  const parentDirData = directoriesData.find(
    (directoryData) => directoryData.id === parentDirId
  );

  // Check if parent directory exists
  if (!parentDirData) {
    return res.status(404).json({ error: "Parent directory not found!" });
  }

  // Check if the directory belongs to the user
  if (parentDirData.userId !== req.user.id) {
    return res.status(403).json({
      error: "You do not have permission to upload to this directory.",
    });
  }

  const filename = req.headers.filename || "untitled";
  const id = crypto.randomUUID();
  const extension = path.extname(filename);
  const fullFileName = `${id}${extension}`;

  const writeStream = createWriteStream(`./storage/${fullFileName}`);
  req.pipe(writeStream);

  req.on("end", async () => {
    filesData.push({
      id,
      extension,
      name: filename,
      parentDirId,
    });

    parentDirData.files.push(id);

    try {
      await writeFile("./filesDB.json", JSON.stringify(filesData));
      await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
      return res.status(201).json({ message: "File Uploaded" });
    } catch (err) {
      next(err);
    }
  });
});

router.get("/:id", (req, res) => {
  res.statusCode = 302;
  res.set({
    location: "https://procodrr.com/",
  });
  return res.end();
  // return res.redirect("https://procodrr.com/");
  const { id } = req.params;
  const fileData = filesData.find((file) => file.id === id);

  console.log(req.query);
  // Check if file exists
  if (!fileData) {
    return res.status(404).json({ error: "File not found!" });
  }

  // Check parent directory ownership
  const parentDir = directoriesData.find(
    (dir) => dir.id === fileData.parentDirId
  );
  if (!parentDir) {
    return res.status(404).json({ error: "Parent directory not found!" });
  }
  if (parentDir.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "You don't have access to this file." });
  }

  // If "download" is requested, set the appropriate headers
  if (req.query.action === "download") {
    res.set("Content-Disposition", `attachment; filename=${fileData.name}`);
  }

  // Send file
  return res.sendFile(
    `${process.cwd()}/storage/${id}${fileData.extension}`,
    (err) => {
      if (!res.headersSent && err) {
        return res.status(404).json({ error: "File not found!" });
      }
    }
  );
});

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const fileData = filesData.find((file) => file.id === id);

  // Check if file exists
  if (!fileData) {
    return res.status(404).json({ error: "File not found!" });
  }

  // Check parent directory ownership
  const parentDir = directoriesData.find(
    (dir) => dir.id === fileData.parentDirId
  );
  if (!parentDir) {
    return res.status(404).json({ error: "Parent directory not found!" });
  }
  if (parentDir.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "You don't have access to this file." });
  }

  // Perform rename
  fileData.name = req.body.newFilename;
  try {
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    return res.status(200).json({ message: "Renamed" });
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  const fileIndex = filesData.findIndex((file) => file.id === id);

  // Check if file exists
  if (fileIndex === -1) {
    return res.status(404).json({ error: "File not found!" });
  }

  const fileData = filesData[fileIndex];

  // Check parent directory ownership
  const parentDir = directoriesData.find(
    (dir) => dir.id === fileData.parentDirId
  );
  if (!parentDir) {
    return res.status(404).json({ error: "Parent directory not found!" });
  }
  if (parentDir.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "You don't have access to this file." });
  }

  try {
    // Remove file from filesystem
    await rm(`./storage/${id}${fileData.extension}`, { recursive: true });

    // Remove file from DB
    filesData.splice(fileIndex, 1);
    parentDir.files = parentDir.files.filter((fileId) => fileId !== id);

    // Persist changes
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));

    return res.status(200).json({ message: "File Deleted Successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
