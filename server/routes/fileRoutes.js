import express from "express";
import mongoose from "mongoose";
import gridfsStream from "gridfs-stream";

const router = express.Router();
let gfs;

// Initialize GridFS when the mongoose connection is ready.
mongoose.connection.once("open", () => {
  gfs = gridfsStream(mongoose.connection.db, mongoose.mongo);
  // Optionally set the bucket name if it’s not the default "fs".
  gfs.collection("uploads");
});

// GET /files/:filename - Stream the requested file
router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  gfs.files.findOne({ filename: filename }, (err, file) => {
    if (err || !file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Set appropriate headers and pipe the file read stream to response
    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`);

    const readstream = gfs.createReadStream({ filename: file.filename });
    readstream.on("error", (error) => {
      console.error("Read stream error:", error);
      res.status(500).json({ message: "Error reading file" });
    });
    readstream.pipe(res);
  });
});

export default router;
