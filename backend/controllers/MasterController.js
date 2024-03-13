import { Sequelize } from "sequelize";
import { JurusanModel, UnivModel } from "../models/CollegeModel.js";
import { SiswaIpaModel } from "../models/IpaModel.js";

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
      siswaLength: siswaLength,
      jurusanLength: jurusanLength,
      univLength: univLength,
      eligLength: eligLength // Jumlah data sesuai dengan kriteria yang diberikan
    });    
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil dataset!",
      error: error.message,
    });
  }
};