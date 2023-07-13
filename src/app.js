import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import { handler } from "./middlewares/errors-handler.js";
import path from "path";
import cookieParser from "cookie-parser";
import { io } from "./socket.js";
import http from "http";
import winston from "winston";


const app = express();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

app.use((req, res, next) => {
  logger.info(
    `${req.method} ${req.originalUrl} - ${req.ip} - ${new Date().toISOString()}`
  );
  next();
});

app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }));
app.use(express.json());
app.use(cookieParser("secret"));

app.use("/api/storage", express.static(path.resolve('src/storage')));
app.use("/api", router);
app.use(handler);

const server = http.createServer(app)
const socket = io(server);


export default server;
