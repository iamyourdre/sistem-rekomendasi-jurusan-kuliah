import express from "express";
const app = express();
import datasetRoutes from "./routes/IpaRoute.js";
import NBv1router from "./routes/NaiveBayesV1Route.js";


app.use(express.urlencoded({ extended: true }));
datasetRoutes(app);
NBv1router(app);

app.listen(5000, () => console.log('Server up and running...'));