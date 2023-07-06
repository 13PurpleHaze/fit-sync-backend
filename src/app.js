import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import { handler } from "./middlewares/errors-handler.js";
import path from "path";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/storage", express.static(path.resolve('src/storage')));
app.use("/api", router);
app.use(handler);


export default app;
