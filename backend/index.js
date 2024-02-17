import express from "express";
const app = express();
import {datasetRoutes, NBv1router} from "./routes/MainRoute.js";


app.use(express.urlencoded({ extended: true }));
datasetRoutes(app);
NBv1router(app);

app.listen(5000, () => console.log('Server up and running...'));