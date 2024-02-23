import { Sequelize } from "sequelize";
import { erf } from 'mathjs';
import { SiswaIpaModel, SummaryIpaModel } from "../models/IpaModel.js";
import NbIpaV1Model from "../models/NaiveBayesV1Model.js";

export const naiveBayesClassifier = async (req, res) => {
  try {
    const { x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 } = req.body;

    const normDistData = await calcNormDist(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15);
    const probData = await calcProbability(normDistData);
    const result = await calcResult(probData);

    res.status(201).json({
        msg: "Calculation Completed! Your input is classified as:",
        result: result
    });
  } catch (error) {
      console.log(error.message);
  }
};

export const createTrainingData = async (req, res) => {
  try {
    
    await NbIpaV1Model.destroy({ where: {} });

    await setProbability(res);
    await setMean(res);
    await setStdev(res);
      
    res.status(200).json({
      message: "Selesai membuat data latih!",
      data: await NbIpaV1Model.findAll()
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat data latih!",
      error: error.message,
    });
  }
};

export const setProbability = async (res) => {
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

    await NbIpaV1Model.bulkCreate(jurusanCountTemp);
    
  } catch (error) {
    throw new Error(error.message);
  }
};

export const setMean = async (res) => {
  try {
    
    const dataset = await NbIpaV1Model.findAll();

    for (const d of dataset) {
      // Ambil semua summary nilai
      const sumNilai = await SummaryIpaModel.findAll({
        include: [
          {
            model: SiswaIpaModel,
            as: 'summary_ipa_key',
            where: {
              jurusan_id: d.jurusan_id,
            },
          },
        ],
        raw: true,
      });

      if (sumNilai) {
        
        let totalMeanPABP = 0;
        let totalMeanPPKN = 0;
        let totalMeanBIND = 0;
        let totalMeanMTKW = 0;
        let totalMeanSIND = 0;
        let totalMeanBINGW = 0;
        let totalMeanSBUD = 0;
        let totalMeanPJOK = 0;
        let totalMeanPKWU = 0;
        let totalMeanMTKT = 0;
        let totalMeanBIO = 0;
        let totalMeanFIS = 0;
        let totalMeanKIM = 0;
        let totalMeanEKO = 0;
        let totalMeanBINGT = 0;
    
        // Menjumlahkan "x1", "x2", "x3", dst...
        sumNilai.forEach(sum => {
            totalMeanPABP += sum.mean_PABP;
            totalMeanPPKN += sum.mean_PPKN;
            totalMeanBIND += sum.mean_B_IND;
            totalMeanMTKW += sum.mean_MTK_W;
            totalMeanSIND += sum.mean_S_IND;
            totalMeanBINGW += sum.mean_BING_W;
            totalMeanSBUD += sum.mean_S_BUD;
            totalMeanPJOK += sum.mean_PJOK;
            totalMeanPKWU += sum.mean_PKWU;
            totalMeanMTKT += sum.mean_MTK_T;
            totalMeanBIO += sum.mean_BIO;
            totalMeanFIS += sum.mean_FIS;
            totalMeanKIM += sum.mean_KIM;
            totalMeanEKO += sum.mean_EKO;
            totalMeanBINGT += sum.mean_BING_T;
        });

        // Menghitung mean "x1", "x2", "x3", dst...
        const mean_x1 = totalMeanPABP / sumNilai.length;
        const mean_x2 = totalMeanPPKN / sumNilai.length;
        const mean_x3 = totalMeanBIND / sumNilai.length;
        const mean_x4 = totalMeanMTKW / sumNilai.length;
        const mean_x5 = totalMeanSIND / sumNilai.length;
        const mean_x6 = totalMeanBINGW / sumNilai.length;
        const mean_x7 = totalMeanSBUD / sumNilai.length;
        const mean_x8 = totalMeanPJOK / sumNilai.length;
        const mean_x9 = totalMeanPKWU / sumNilai.length;
        const mean_x10 = totalMeanMTKT / sumNilai.length;
        const mean_x11 = totalMeanBIO / sumNilai.length;
        const mean_x12 = totalMeanFIS / sumNilai.length;
        const mean_x13 = totalMeanKIM / sumNilai.length;
        const mean_x14 = totalMeanEKO / sumNilai.length;
        const mean_x15 = totalMeanBINGT / sumNilai.length;

        await NbIpaV1Model.update(
          {
              mean_x1: mean_x1,
              mean_x2: mean_x2,
              mean_x3: mean_x3,
              mean_x4: mean_x4,
              mean_x5: mean_x5,
              mean_x6: mean_x6,
              mean_x7: mean_x7,
              mean_x8: mean_x8,
              mean_x9: mean_x9,
              mean_x10: mean_x10,
              mean_x11: mean_x11,
              mean_x12: mean_x12,
              mean_x13: mean_x13,
              mean_x14: mean_x14,
              mean_x15: mean_x15
          },
          {
            where: { jurusan_id: d.jurusan_id },
          }
        );
      }
    
    }
    
  } catch (error) {
    throw new Error(error.message);
  }
};

export const setStdev = async (res) => {
  try {

    const dataset = JSON.parse(JSON.stringify(await NbIpaV1Model.findAll()));

    for (const d of dataset) {

      // Ambil semua summary nilai
      const sumNilai = await SummaryIpaModel.findAll({
        include: [
          {
            model: SiswaIpaModel,
            as: 'summary_ipa_key',
            where: {
              jurusan_id: d.jurusan_id,
            },
          },
        ],
        raw: true,
      });

      if (sumNilai.length > 0) {

        const variance_x1 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_PABP - d.mean_x1, 2), 0) / sumNilai.length;
        const variance_x2 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_PPKN - d.mean_x2, 2), 0) / sumNilai.length;
        const variance_x3 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_B_IND - d.mean_x3, 2), 0) / sumNilai.length;
        const variance_x4 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_MTK_W - d.mean_x4, 2), 0) / sumNilai.length;
        const variance_x5 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_S_IND - d.mean_x5, 2), 0) / sumNilai.length;
        const variance_x6 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_BING_W - d.mean_x6, 2), 0) / sumNilai.length;
        const variance_x7 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_S_BUD - d.mean_x7, 2), 0) / sumNilai.length;
        const variance_x8 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_PJOK - d.mean_x8, 2), 0) / sumNilai.length;
        const variance_x9 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_PKWU - d.mean_x9, 2), 0) / sumNilai.length;
        const variance_x10 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_MTK_T - d.mean_x10, 2), 0) / sumNilai.length;
        const variance_x11 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_BIO - d.mean_x11, 2), 0) / sumNilai.length;
        const variance_x12 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_FIS - d.mean_x12, 2), 0) / sumNilai.length;
        const variance_x13 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_KIM - d.mean_x13, 2), 0) / sumNilai.length;
        const variance_x14 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_EKO - d.mean_x14, 2), 0) / sumNilai.length;
        const variance_x15 = sumNilai.reduce((acc, nilai) => acc + Math.pow(nilai.mean_BING_T - d.mean_x15, 2), 0) / sumNilai.length;
        
        // Menghitung standar deviasi dari varians
        const std_x1 = Math.sqrt(variance_x1);
        const std_x2 = Math.sqrt(variance_x2);
        const std_x3 = Math.sqrt(variance_x3);
        const std_x4 = Math.sqrt(variance_x4);
        const std_x5 = Math.sqrt(variance_x5);
        const std_x6 = Math.sqrt(variance_x6);
        const std_x7 = Math.sqrt(variance_x7);
        const std_x8 = Math.sqrt(variance_x8);
        const std_x9 = Math.sqrt(variance_x9);
        const std_x10 = Math.sqrt(variance_x10);
        const std_x11 = Math.sqrt(variance_x11);
        const std_x12 = Math.sqrt(variance_x12);
        const std_x13 = Math.sqrt(variance_x13);
        const std_x14 = Math.sqrt(variance_x14);
        const std_x15 = Math.sqrt(variance_x15);

        await NbIpaV1Model.update(
          {
            std_x1: std_x1,
            std_x2: std_x2,
            std_x3: std_x3,
            std_x4: std_x4,
            std_x5: std_x5,
            std_x6: std_x6,
            std_x7: std_x7,
            std_x8: std_x8,
            std_x9: std_x9,
            std_x10: std_x10,
            std_x11: std_x11,
            std_x12: std_x12,
            std_x13: std_x13,
            std_x14: std_x14,
            std_x15: std_x15
          },
          {
            where: { jurusan_id: d.jurusan_id }
          }
        );
        
      }
    }
    
  } catch (error) {
    throw new Error(error.message);
  }
};

export const calcNormDist = async (x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15) => {
  try {
    // Mendapatkan semua data dari model NbIpaV1Model
    const dataset = await NbIpaV1Model.findAll();

    // Menyimpan hasil distribusi normal
    const normDistData = [];

    // Iterasi melalui setiap data dalam dataset
    for (const d of dataset) {
      // Menghitung distribusi normal untuk setiap atribut
      const nd_x1 = 0.5 * (1 + erf((x1 - d.mean_x1) / (d.std_x1 * Math.sqrt(2))));
      const nd_x2 = 0.5 * (1 + erf((x2 - d.mean_x2) / (d.std_x2 * Math.sqrt(2))));
      const nd_x3 = 0.5 * (1 + erf((x3 - d.mean_x3) / (d.std_x3 * Math.sqrt(2))));
      const nd_x4 = 0.5 * (1 + erf((x4 - d.mean_x4) / (d.std_x4 * Math.sqrt(2))));
      const nd_x5 = 0.5 * (1 + erf((x5 - d.mean_x5) / (d.std_x5 * Math.sqrt(2))));
      const nd_x6 = 0.5 * (1 + erf((x6 - d.mean_x6) / (d.std_x6 * Math.sqrt(2))));
      const nd_x7 = 0.5 * (1 + erf((x7 - d.mean_x7) / (d.std_x7 * Math.sqrt(2))));
      const nd_x8 = 0.5 * (1 + erf((x8 - d.mean_x8) / (d.std_x8 * Math.sqrt(2))));
      const nd_x9 = 0.5 * (1 + erf((x9 - d.mean_x9) / (d.std_x9 * Math.sqrt(2))));
      const nd_x10 = 0.5 * (1 + erf((x10 - d.mean_x10) / (d.std_x10 * Math.sqrt(2))));
      const nd_x11 = 0.5 * (1 + erf((x11 - d.mean_x11) / (d.std_x11 * Math.sqrt(2))));
      const nd_x12 = 0.5 * (1 + erf((x12 - d.mean_x12) / (d.std_x12 * Math.sqrt(2))));
      const nd_x13 = 0.5 * (1 + erf((x13 - d.mean_x13) / (d.std_x13 * Math.sqrt(2))));
      const nd_x14 = 0.5 * (1 + erf((x14 - d.mean_x14) / (d.std_x14 * Math.sqrt(2))));
      const nd_x15 = 0.5 * (1 + erf((x15 - d.mean_x15) / (d.std_x15 * Math.sqrt(2))));

      // Menambahkan data distribusi normal ke dalam array
      normDistData.push({
          nd_x1,
          nd_x2,
          nd_x3,
          nd_x4,
          nd_x5,
          nd_x6,
          nd_x7,
          nd_x8,
          nd_x9,
          nd_x10,
          nd_x11,
          nd_x12,
          nd_x13,
          nd_x14,
          nd_x15
      });
    }
    
    return normDistData;
  } catch (error) {
    throw new Error(error.message);
  }
};
