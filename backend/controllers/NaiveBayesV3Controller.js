import { Sequelize } from "sequelize";
import { erf } from 'mathjs';
import { SiswaIpaModel, SummaryIpaModel } from "../models/IpaModel.js";
import {NbIpaV3MapelModel, NbIpaV3FreqModel} from "../models/NaiveBayesV3Model.js";
import { JurusanModel } from "../models/CollegeModel.js";

// export const naiveBayesClassifier = async (req, res) => {
//   try {
//     const { x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 } = req.body;

//     const normDistData = await calcNormDist(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15);
//     const probData = await calcProbability(normDistData);
//     const result = await calcResult(probData);

//     res.status(200).json({
//         msg: "Calculation Completed! Your input is classified as:",
//         result: result,
//         normDistData: normDistData,
//         probData: probData
//     });

//   } catch (error) {
//       console.log(error.message);
//   }
// };

export const createTrainingData = async (req, res) => {
  try {
    
    NbIpaV3MapelModel.destroy({ where: {} });

    setupDatasetTable(res);
      
    res.status(200).json({
      message: "Selesai membuat data latih!",
      data: await NbIpaV3MapelModel.findAll({
        include: [
          {
            model: NbIpaV3FreqModel,
            as: 'nb_ipa_v3_freq_key'
          },
        ]
      })
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat data latih!",
      error: error.message,
    });
  }
};

export const setupDatasetTable = async (res) => {

  try {
    // Mengambil daftar jurusan tanpa redundansi
    const jurusan = await JurusanModel.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
        }
      }
    })
    
    console.log(jurusan)
    
    const mapelTemp = [];

    // Membuat tabel mapel untuk setiap jurusan
    jurusan.forEach((d) => {
      const nb_ipa_v3_mapel = [];
    
      for (let i = 1; i <= 15; i++) {
        nb_ipa_v3_mapel.push({
          jurusan_id: d.id,
          x: i
        });
      }
    
      mapelTemp.push(nb_ipa_v3_mapel);
    });
    
    // Menggunakan bulkCreate untuk menambahkan baris-baris ke dalam tabel NbIpaV3MapelModel
    mapelTemp.forEach(async (nb_ipa_v3_mapel) => {
      const mapelCreated = await NbIpaV3MapelModel.bulkCreate(nb_ipa_v3_mapel);
      const createdFreqs = [];
      
      for (const mapel of mapelCreated) {
        const freqData = [
          { mapel_id: mapel.id, bobot: "A", p_no: 1, p_yes: 1 },
          { mapel_id: mapel.id, bobot: "A-", p_no: 1, p_yes: 1 },
          { mapel_id: mapel.id, bobot: "B+", p_no: 1, p_yes: 1 },
          { mapel_id: mapel.id, bobot: "B", p_no: 1, p_yes: 1 },
          { mapel_id: mapel.id, bobot: "B-", p_no: 1, p_yes: 1 },
          { mapel_id: mapel.id, bobot: "CDE", p_no: 1, p_yes: 1 }
        ];
      
        const createdFreq = await NbIpaV3FreqModel.bulkCreate(freqData);
        createdFreqs.push(createdFreq);
      }

    });    
  
  } catch (error) {
    throw new Error(error.message);
  }

}