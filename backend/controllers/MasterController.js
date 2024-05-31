import { Sequelize } from "sequelize";
import { JurusanModel, UniversitasModel } from "../models/CollegeModel.js";
import { SiswaModel, SummaryModel } from "../models/DataSiswaModel.js";

export const getDataLength = async (req, res) => {
  try {
    const eligLength = await SiswaModel.count({
      include: [
        {
          model: JurusanModel,
          as: 'jurusan_key',
          where: {
            id: {
              [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
            }
          },
        }
      ],
    });
    const siswaLength = await SiswaModel.count({});
    const jurusanLength = await JurusanModel.count({});
    const univLength = await UniversitasModel.count({});
    
    res.status(200).json({
      siswaLength,
      jurusanLength,
      univLength,
      eligLength
    });    
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil dataset!",
      error: error.message,
    });
  }
};

export const resetDataset = async (res) => {
  try {

    await DataSiswaModel.destroy({ where: {} });
    await SiswaModel.destroy({ where: {} });
    await SummaryModel.destroy({ where: {} });

    return {
      success: true,
      message: "Berhasil menghapus semua dataset!",
    };
  } catch (error) {
    return {
      message: "Gagal menghapus semua dataset!",
      error: error.message,
    };
  }
};