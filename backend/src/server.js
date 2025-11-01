import dotenv from "dotenv";
import express from "express";
import { configRoutes } from "./routes/configRoutes.js";
import { logsRoutes } from "./routes/logsRoutes.js";
import { statusRoutes } from "./routes/statusRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
