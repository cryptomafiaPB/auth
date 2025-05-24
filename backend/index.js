import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";
import cookieParser from "cookie-parser";

// import routes
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.use(
  cors({
    AccessControlAllowCredentials: true,
    credentials: true,
    origin: [
      "http://127.0.0.1:3000",
      "http://localhost:3000",
      process.env.BASE_URL,
      process.env.CLIENT_URL,
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// DATABASE CONNECTED
db();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.listen(port, (req, res) => {
  console.log("Listning on port: ", port);
});
