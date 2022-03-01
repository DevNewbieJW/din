import expandTilde from "expand-tilde";
import child_process from "child_process";

import { extname, join } from "path";
import { readdirSync } from "fs";
import { fileIconToBuffer } from "file-icon";

class Haru {
  constructor() {
    this.cache = [];
    this.notes = [];
    this.directories = [
      expandTilde("/Applications"),
      expandTilde("~/Applications"),
      expandTilde("/System/Applications"),
    ];
  }

  makeId() {
    return Math.random().toString(32).slice(2);
  }

  async getIcon(path) {
    const icon = await fileIconToBuffer(path);
    return icon;
  }

  listFiles() {
    for (const directory of this.directories) {
      const files = readdirSync(directory, { withFileTypes: true });
      for (const file in files) {
        // const isApp = extname(files[file].name) === ".app";
        // if (isApp) {
        const filePath = join(directory, files[file].name);
        this.notes.push({
          name: files[file].name,
          filePath,
          id: this.makeId(),
        });
        // }
      }
    }
    this.cache = this.notes;
    this.notes = [];
    return this.cache;
  }

  findFileById(id) {
    return this.cache.filter((file) => file.id == id)[0];
  }

  openFileById(file) {
    child_process.execFile("open", [file.filePath]);
    return file;
  }
}

export default Haru;
