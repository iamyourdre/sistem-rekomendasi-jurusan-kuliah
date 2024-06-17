import express from "express";
import formData from "../middlewares/ReqBodyHandler.cjs";
import { uploadDataSiswa } from "../controllers/DataSiswaController.js";
import { createTrainingData, naiveBayesClassifier  } from "../controllers/DatasetController.js";
import { evalLOOCV  } from "../controllers/EvalController.js";
import {
  getDataLength,
  getDataSiswa,
  getSiswaEligible,
  getDataset,
  getEval,
  getCollege,
  resetDataset
} from "../controllers/UtilsController.js";

const siswaRouter = express.Router();
const datasetRouter = express.Router();
const evalRouter = express.Router();
const utilsRouter = express.Router();

siswaRouter.post("/upload", formData.single("file"), uploadDataSiswa);
siswaRouter.get("/getDataSiswa", getDataSiswa);
siswaRouter.get("/getSiswaEligible", getSiswaEligible);
siswaRouter.get("/getCollege", getCollege);

datasetRouter.post("/createTrainingData", createTrainingData);
datasetRouter.post("/naiveBayesClassifier", formData.single(), naiveBayesClassifier);

evalRouter.get("/evalLOOCV", evalLOOCV);

utilsRouter.get("/getDataset", getDataset);
utilsRouter.get("/getEval", getEval);
utilsRouter.get("/getDataLength", getDataLength);
utilsRouter.get("/getDataLength", getDataLength);
utilsRouter.get("/resetDataset", resetDataset);

export { siswaRouter, datasetRouter, utilsRouter, evalRouter };
