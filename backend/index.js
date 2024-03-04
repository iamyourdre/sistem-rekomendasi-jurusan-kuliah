import express from "express";
import { datasetRouter, nbRouter } from "./routes/MainRoute.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use("/api/dataset", datasetRouter);
app.use("/api/nb", nbRouter);

app.listen(5000, () => console.log('Server up and running...'));
