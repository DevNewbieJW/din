import express from "express";
import cors from "cors";
const app = express();

import { router } from "./routes.js";

app.use(express.json());
app.use(cors());
app.use("/", router);

app.listen(5001, () => "Server is listening on port 5000");
