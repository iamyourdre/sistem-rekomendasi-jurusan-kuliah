import express from "express";
const app = express();
import initRoutes from "./routes/IpaRoute.js";


app.use(express.urlencoded({ extended: true }));
initRoutes(app);

app.listen(5000, () => console.log('Server up and running...'));