import express from "express";
import { countProbability } from "../controllers/NaiveBayesV1Controller.js";

const router = express.Router();

let NBv1router = (app) => {
  router.post("/countProbability", countProbability);
  app.use("/api/nbv1", router);
};

export default NBv1router;
