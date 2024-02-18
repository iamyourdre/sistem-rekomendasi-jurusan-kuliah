import { Sequelize } from "sequelize";
import { erf } from 'mathjs';
import { SiswaIpaModel, SummaryIpaModel } from "../models/IpaModel.js";
import NbIpaV1Model from "../models/NaiveBayesV1Model.js";
import { JurusanModel } from "../models/CollegeModel.js";

export const createTrainingData = async (req, res) => {
  try {
    
    await NbIpaV1Model.destroy({ where: {} });

    const probability = await setProbability();
    await setMean();
    // await countStdev();
      
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

export const setProbability = async (req, res) => {
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
    
  } catch (error) {
    res.status(500).json({
      message: "Gagal melakukan operasi countProbability!",
      error: error.message,
    });
  }
};


export const setMean = async (req, res) => {
  try {
    
    const dataset = await NbIpaV1Model.findAll();
    let sumNilai;

    for (const d of dataset) {
      // Ambil semua summary nilai
      sumNilai = await SummaryIpaModel.findAll({
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
    res.status(500).json({
      message: "Gagal melakukan operasi countMean!",
      error: error.message,
    });
  }
};
