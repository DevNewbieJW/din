import child_process from "child_process";
import expandTilde from "expand-tilde";

import { extname, join } from "path";
import { readdirSync } from "fs";
import { fileIconToBuffer } from "file-icon";

const directories = [expandTilde("/Applications"), expandTilde("~/Applications"), expandTilde("/System/Applications")];

const makeId = () => Math.random().toString(32).slice(2);

const getIcon = async (path) => {
  const icon = await fileIconToBuffer(path);
  return icon;
};

let notes = [];
for (const appDir of directories) {
  const files = readdirSync(appDir, { withFileTypes: true });
  for (const file in files) {
    if (!files[file].name.startsWith(".")) {
      const isApp = extname(files[file].name) === ".app";
      if (isApp) {
        const filePath = join(appDir, files[file].name);
        notes.push({ name: files[file].name, filePath, id: makeId() });
      }
    }
  }
}

export const findFileById = (id) => {
  return notes.filter((file) => file.id == id)[0];
};

export const openFileById = (id) => {
  const file = findFileById(id);
  child_process.execFile("open", [file.filePath]);
  return file;
};

export const getImageById = async (id) => {
  const file = findFileById(id);
  const iconBuffer = await getIcon(file.filePath);
  return iconBuffer;
};

export const listFiles = () => {
  const cache = notes;

  return cache;
};
