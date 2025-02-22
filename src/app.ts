import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import userController from "./controllers/cinemaController";
app.use("/cinema", userController);

export default app;
