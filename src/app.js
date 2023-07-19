import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import { handler } from "./middlewares/errors-handler.js";
import path from "path";
import cookieParser from "cookie-parser";
import { initSockets } from "./socket.js";
import http from "http";
import 'dotenv/config';
import logger from "./logger.js";

const app = express();

app.use((req, res, next) => {
  logger.info(
    `${req.method} ${req.originalUrl} - ${req.get('User-Agent')} - ${req.ip} - ${new Date().toISOString()}`
  );
  next();
});

app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/storage", express.static(path.resolve('src/storage')));
app.use("/api", router);
app.use(handler);

const server = http.createServer(app)
initSockets(server);

export default server;
