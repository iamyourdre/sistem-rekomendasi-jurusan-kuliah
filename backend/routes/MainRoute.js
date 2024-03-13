import express from "express";
import formData from "../middlewares/ReqBodyHandler.cjs";
import { 
  upload,
  getAllIpa,
  deleteAllIpa,
  getEligibleIpa
} from "../controllers/IpaController.js";
import { getAllCollege } from "../controllers/CollegeController.js";
import { createTrainingData, naiveBayesClassifier, getAllNbIpaV3Data } from "../controllers/NaiveBayesV3Controller.js";
import { getDataLength } from "../controllers/MasterController.js";

const datasetRouter = express.Router(); // Membuat router khusus untuk dataset routes
const nbRouter = express.Router(); // Membuat router khusus untuk NB routes
const masterRouter = express.Router(); // Membuat router khusus untuk Master routes

// Definisi rute-rute untuk dataset
datasetRouter.post("/upload", formData.single("file"), upload);
datasetRouter.get("/getAllIpa", getAllIpa);
datasetRouter.get("/getEligibleIpa", getEligibleIpa);
datasetRouter.delete("/reset", deleteAllIpa);
datasetRouter.get("/getAllCollege", getAllCollege);

// Definisi rute-rute untuk NB
nbRouter.post("/createTrainingData", createTrainingData);
nbRouter.post("/naiveBayesClassifier", formData.single(), naiveBayesClassifier);
nbRouter.get("/getAllDataset", getAllNbIpaV3Data);

// Definisi rute-rute untuk Master
masterRouter.get("/getDataLength", getDataLength);

// Exporting the routers
export { datasetRouter, nbRouter, masterRouter };
