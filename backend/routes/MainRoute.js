import express from "express";
import formData from "../middlewares/ReqBodyHandler.cjs";
import { 
  upload,
  getAllIpa,
  deleteAllIpa
} from "../controllers/IpaController.js";
import { getAllCollege } from "../controllers/CollegeController.js";
import { createTrainingData, getAllNbIpaV3Data } from "../controllers/NaiveBayesV3Controller.js";

const datasetRouter = express.Router(); // Membuat router khusus untuk dataset routes
const nbRouter = express.Router(); // Membuat router khusus untuk NBv1 routes

// Definisi rute-rute untuk dataset
datasetRouter.post("/upload", formData.single("file"), upload);
datasetRouter.get("/getAllIpa", getAllIpa);
datasetRouter.delete("/reset", deleteAllIpa);
datasetRouter.get("/getAllCollege", getAllCollege);

// Definisi rute-rute untuk NB
nbRouter.post("/createTrainingData", createTrainingData);
// nbRouter.post("/naiveBayesClassifier", formData.single(), naiveBayesClassifier);
nbRouter.get("/getAllDataset", getAllNbIpaV3Data);

// Exporting the routers
export { datasetRouter, nbRouter };
