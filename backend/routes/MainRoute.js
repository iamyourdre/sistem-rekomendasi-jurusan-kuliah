import express from "express";
import formData from "../middlewares/ReqBodyHandler.cjs";
import { 
  uploadDataSiswa,
  getDataSiswa,
  getSiswaEligible
} from "../controllers/DataSiswaController.js";
import { getCollege } from "../controllers/CollegeController.js";
import { createTrainingData, naiveBayesClassifier, getDataset } from "../controllers/DatasetController.js";
import { getDataLength } from "../controllers/MasterController.js";

const datasetRouter = express.Router(); // Membuat router khusus untuk dataset routes
const nbRouter = express.Router(); // Membuat router khusus untuk NB routes
const masterRouter = express.Router(); // Membuat router khusus untuk Master routes

// Definisi rute-rute untuk dataset
datasetRouter.post("/upload", formData.single("file"), uploadDataSiswa);
datasetRouter.get("/getDataSiswa", getDataSiswa);
datasetRouter.get("/getSiswaEligible", getSiswaEligible);
datasetRouter.get("/getCollege", getCollege);

// Definisi rute-rute untuk NB
nbRouter.post("/createTrainingData", createTrainingData);
nbRouter.post("/naiveBayesClassifier", formData.single(), naiveBayesClassifier);
nbRouter.get("/getAllDataset", getDataset);

// Definisi rute-rute untuk Master
masterRouter.get("/getDataLength", getDataLength);

// Exporting the routers
export { datasetRouter, nbRouter, masterRouter };
