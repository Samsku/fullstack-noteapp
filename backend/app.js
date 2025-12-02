import config from "./utils/config.js";
import mongoose from "mongoose";
import middleware from "./utils/middleware.js";
import logger from "./utils/logger.js";
import notesRouter from "./controllers/notes.js";
import express from "express";
const app = express();

// logger.info("connecting to", config.MONGODB_URI);

// mongoose
//   .connect(config.MONGODB_URI, { family: 4 })
//   .then(() => {
//     logger.info("connected to MongoDB");
//   })
//   .catch((error) => {
//     logger.error("error connection to MongoDB:", error.message);
//   });

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
