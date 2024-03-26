import { Sequelize } from "sequelize";
import { JurusanModel, UnivModel } from "../models/CollegeModel.js";
import { NilaiIpaModel, SiswaIpaModel, SummaryIpaModel } from "../models/IpaModel.js";

export const getDataLength = async (req, res) => {
  try {
    const eligLength = await SiswaIpaModel.count({
      include: [
        {
          model: JurusanModel,
          as: 'jurusan_ipa_key',
          where: {
            id: {
              [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
            }
          },
        }
      ],
    });
    const siswaLength = await SiswaIpaModel.count({});
    const jurusanLength = await JurusanModel.count({});
    const univLength = await UnivModel.count({});
    
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

    await NilaiIpaModel.destroy({ where: {} });
    await SiswaIpaModel.destroy({ where: {} });
    await SummaryIpaModel.destroy({ where: {} });

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