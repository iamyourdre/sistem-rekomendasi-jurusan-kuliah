import { Sequelize } from "sequelize";
import { erf } from 'mathjs';
import { JurusanModel } from "../models/CollegeModel.js";
import { SiswaIpaModel } from "../models/IpaModel.js";
import db from "../config/Database.js";

export const createTrainingData = async (req, res) => {
  try {
    
    await countProbability();
    await countMean();
    await countStdev();
      
    res.status(200).send({
      message: "Selesai membuat data latih!",
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
    const jurusanCountArray = [];
    const totalData = await SiswaIpaModel.count();

    // Memasukkan hasil perhitungan ke dalam array
    countedJurusan.forEach((item) => {
      jurusanCountArray.push({
        jurusan_id: item.jurusan_id,
        quantity: item.dataValues.quantity
      });
    });
    
    for (let i = 0; i < jurusanCountArray.length; i++) {
      jurusanCountArray[i].probability = jurusanCountArray[i].quantity / totalData;
    }

    // Mengembalikan respons JSON
    res.status(200).json({
      success: true,
      data: jurusanCountArray
    });
  } catch (error) {
    console.error("Error counting jurusan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
