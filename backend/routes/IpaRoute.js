import express from "express";
import uploadFile from "../middlewares/Upload.cjs";
import { 
  upload,
  getAllIpa,
  deleteAllIpa
} from "../controllers/IpaController.js";

const router = express.Router();

let routes = (app) => {
  router.post("/upload", uploadFile.single("file"), upload);
  router.get("/dataset", getAllIpa);
  router.delete("/reset", deleteAllIpa); // Menambah rute untuk menghapus semua data
  app.use("/api/excel", router);
};

export default routes;
