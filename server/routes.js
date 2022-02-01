import express from "express";
const router = express.Router();
import { listFiles, openFileById, getImageById } from "./utils.js";

router.get("/", (req, res) => {
  const files = listFiles();
  res.send(files);
});

router.post("/:id", (req, res) => {
  const { id } = req.body;
  const file = openFileById(id);
  res.send({ file });
});

router.get("/:id/image", async (req, res) => {
  const { id } = req.params;
  const image = await getImageById(id);
  res.send(image);
});

export { router };
