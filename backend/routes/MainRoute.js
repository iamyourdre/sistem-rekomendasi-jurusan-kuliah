import express from "express";
import uploadFile from "../middlewares/Upload.cjs";
import { 
  upload,
  getAllIpa,
  deleteAllIpa
} from "../controllers/IpaController.js";
import { getAllCollege } from "../controllers/CollegeController.js";
import { createTrainingData } from "../controllers/NaiveBayesV1Controller.js";

const router = express.Router();

let datasetRoutes = (app) => {

  router.post("/upload", uploadFile.single("file"), upload);
  router.get("/getAllIpa", getAllIpa);
  router.delete("/reset", deleteAllIpa); // Menambah rute untuk menghapus semua data

  router.get("/getAllCollege", getAllCollege);

  app.use("/api/dataset", router);
};

let NBv1router = (app) => {
  router.post("/createTrainingData", createTrainingData);
  app.use("/api/nbv1", router);
};

export {datasetRoutes, NBv1router};
