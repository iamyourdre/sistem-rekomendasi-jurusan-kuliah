import express from "express";
import formData from "../middlewares/ReqBodyHandler.cjs";
import { uploadDataSiswa } from "../controllers/DataSiswaController.js";
import { getCollege } from "../controllers/UtilsController.js";
import { createTrainingData, naiveBayesClassifier  } from "../controllers/DatasetController.js";
import {
  getDataLength,
  getDataSiswa,
  getSiswaEligible,
  getDataset
} from "../controllers/UtilsController.js";

const siswaRouter = express.Router(); // Membuat router khusus untuk dataset routes
const datasetRouter = express.Router(); // Membuat router khusus untuk NB routes
const utilsRouter = express.Router(); // Membuat router khusus untuk Master routes

siswaRouter.post("/upload", formData.single("file"), uploadDataSiswa);
siswaRouter.get("/getDataSiswa", getDataSiswa);
siswaRouter.get("/getSiswaEligible", getSiswaEligible);
siswaRouter.get("/getCollege", getCollege);

datasetRouter.post("/createTrainingData", createTrainingData);
datasetRouter.post("/naiveBayesClassifier", formData.single(), naiveBayesClassifier);
datasetRouter.get("/getAllDataset", getDataset);

utilsRouter.get("/getDataLength", getDataLength);

export { siswaRouter, datasetRouter, utilsRouter };
