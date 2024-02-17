import { Sequelize } from "sequelize";
import { erf } from 'mathjs';
import { SiswaIpaModel } from "../models/IpaModel.js";
import NbIpaV1Model from "../models/NaiveBayesV1Model.js";

export const createTrainingData = async (req, res) => {
  try {
    
    await NbIpaV1Model.destroy({ where: {} });

    const probability = await countProbability();
    // await countMean();
    // await countStdev();
      
    res.status(200).send({
      message: "Selesai membuat data latih!",
      data: probability
    });

  } catch (error) {
    res.status(500).send({
      message: "Gagal mengimpor data ke database!",
      error: error.message,
    });
  }
};

export const countProbability = async (req, res) => {
  try {

    // Menghitung jumlah kemunculan masing-masing jurusan_id
    const countedJurusan = await SiswaIpaModel.findAll({
      attributes: ['jurusan_id', [Sequelize.fn('COUNT', Sequelize.col('jurusan_id')), 'quantity']],
      group: ['jurusan_id']
    });

    // Membuat array untuk menyimpan pasangan jurusan_id dan quantity
    const jurusanCountTemp = [];
    const totalData = await SiswaIpaModel.count();

    // Memasukkan hasil perhitungan ke dalam array
    countedJurusan.forEach((item) => {
      jurusanCountTemp.push({
        jurusan_id: item.jurusan_id,
        quantity: item.dataValues.quantity
      });
    });
    
    for (let i = 0; i < jurusanCountTemp.length; i++) {
      jurusanCountTemp[i].probability = jurusanCountTemp[i].quantity / totalData;
    }
    
    return await NbIpaV1Model.bulkCreate(jurusanCountTemp)

  } catch (error) {
    console.error("Gagal:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
