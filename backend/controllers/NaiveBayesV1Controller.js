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
      message: "Gagal membuat data latih!",
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
    return {
      success: false,
      message: "Gagal melakukan operasi countProbability!",
      error: error.message,
    };
  }
};


export const countMean = async (res) => {
  try {
    
    const dataset = await NbIpaV1Model.findAll();

    const sumNilai = await SummaryIpaModel.findAll({
      where: {
        jurusan_id: d.genre,
      },
      raw: true,
    });

    // for (const d of dataClass) {
    //   // Ambil semua summary nilai
    //   const samples = await SummaryIpaModel.findAll({
    //     where: {
    //       jurusan_id: d.genre,
    //     },
    //     raw: true,
    //   });

    //   if (samples.length > 0) {
    //     // Hitung rata-rata kolom-kolom "x1", "x2", "x3", dan "x4"
    //     const total_x1 = samples.reduce((acc, sample) => acc + sample.x1, 0);
    //     const total_x2 = samples.reduce((acc, sample) => acc + sample.x2, 0);
    //     const total_x3 = samples.reduce((acc, sample) => acc + sample.x3, 0);
    //     const total_x4 = samples.reduce((acc, sample) => acc + sample.x4, 0);

    //     const average_x1 = total_x1 / samples.length;
    //     const average_x2 = total_x2 / samples.length;
    //     const average_x3 = total_x3 / samples.length;
    //     const average_x4 = total_x4 / samples.length;

    //     // Update Mean
    //     await NB_dataclass.update(
    //       {
    //         mean_x1: average_x1,
    //         mean_x2: average_x2,
    //         mean_x3: average_x3,
    //         mean_x4: average_x4,
    //       },
    //       {
    //         where: { genre: d.genre },
    //       }
    //     );
    //   }
    // }
    
    
    return {
      success: true,
      message: "Berhasil menghapus semua data dalam tabel!",
    };
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil dataset!",
      error: error.message,
    });
  }
};
