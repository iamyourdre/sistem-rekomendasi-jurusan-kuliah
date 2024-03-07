import { upload } from "./IpaController";

export const MasterController = {
  handleUpload: async (req, res) => {
    try {
      await upload(req, res);
    } catch (error) {
      // Tangani kesalahan jika terjadi
      console.error(error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengunggah file",
        error: error.message
      });
    }
  },
  // Metode lain dalam MasterController...
};
