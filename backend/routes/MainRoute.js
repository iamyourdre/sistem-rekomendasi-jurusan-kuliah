import express from "express";
import formData from "../middlewares/ReqBodyHandler.cjs";
import { 
  upload,
  getAllIpa,
  deleteAllIpa,
  testtest
} from "../controllers/IpaController.js";
import { getAllCollege } from "../controllers/CollegeController.js";
import { createTrainingData, naiveBayesClassifier } from "../controllers/NaiveBayesV1Controller.js";

const datasetRouter = express.Router(); // Membuat router khusus untuk dataset routes
const nbv1Router = express.Router(); // Membuat router khusus untuk NBv1 routes

// Definisi rute-rute untuk dataset
datasetRouter.post("/upload", formData.single("file"), upload);
datasetRouter.get("/getAllIpa", getAllIpa);
datasetRouter.delete("/reset", deleteAllIpa);
datasetRouter.get("/getAllCollege", getAllCollege);

// Definisi rute-rute untuk NBv1
nbv1Router.post("/createTrainingData", createTrainingData);
nbv1Router.post("/naiveBayesClassifier", formData.single(), naiveBayesClassifier);

// Exporting the routers
export { datasetRouter, nbv1Router };
