import express from "express";
import Haru from "./core.js";

const router = express.Router();

const haru = new Haru();

router.get("/", (req, res) => {
  const files = haru.listFiles();
  res.send(files);
});

router.post("/:id", (req, res) => {
  const { id } = req.body;
  const file = haru.findFileById(id);
  haru.openFileById(file);
  res.send(file);
});

router.get("/:id/image", async (req, res) => {
  const { id } = req.params;
  const file = haru.findFileById(id);

  const image = await haru.getIcon(file.filePath);
  res.send(image);
});

export { router };
