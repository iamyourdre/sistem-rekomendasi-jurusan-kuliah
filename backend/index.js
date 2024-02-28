import express from "express";
import { datasetRouter, nbv1Router } from "./routes/MainRoute.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use("/api/dataset", datasetRouter);
app.use("/api/nbv1", nbv1Router);

app.listen(5000, () => console.log('Server up and running...'));
