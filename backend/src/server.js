import dotenv from "dotenv";
import express from "express";
import { configRoutes } from "./routes/configRoutes.js";
import { logsRoutes } from "./routes/logsRoutes.js";
import { statusRoutes } from "./routes/statusRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the Drone Config API");
});
app.use("/api/config", configRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/status", statusRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
