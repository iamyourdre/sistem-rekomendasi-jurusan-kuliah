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
    
    await NbIpaV3MapelModel.destroy({ where: {} });

    await setMapelTable(res);
    await setFreqTable(res);
      
    res.status(200).json({
      message: "Selesai membuat data latih!"
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat data latih!",
      error: error.message,
    });
  }
};

export const setMapelTable = async (res) => {

  try {
    // Mengambil daftar jurusan tanpa redundansi
    const jurusan = await JurusanModel.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
        }
      }
    })
    
    const mapelTemp = [];// Membuat objek untuk menyimpan jumlah data dalam masing-masing rentang

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
      await NbIpaV3MapelModel.bulkCreate(nb_ipa_v3_mapel);
    });    
  
  } catch (error) {
    throw new Error(error.message);
  }

}

export const setFreqTable = async (res) => {

  try {

    // Mengambil daftar jurusan tanpa redundansi
    const jurusan = await JurusanModel.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
        }
      }
    })

    // Melakukan iterasi untuk setiap jurusan_id
    jurusan.forEach(async(j) => {

      // Ambil semua summary nilai mapel terkait
      const sumNilai = await SummaryIpaModel.findAll({
        include: [
          {
            model: SiswaIpaModel,
            as: 'summary_ipa_key',
            where: {
              jurusan_id: j.id,
            },
          },
        ],
        raw: true,
      });

      // Melakukan iterasi untuk setiap mapel
      for (let x = 1; x <= 15; x++) {
        
        const bobotTemp = [1, 1, 1, 1, 1, 1];

        // Mengambil parent dari tiap mapel dengan jurusan_id dan mapel (x) tertentu
        const mapel = await NbIpaV3MapelModel.findAll({
          where: {
            jurusan_id: j.id,
            x: x
          },
          raw: true,
        });
        
        // Menghitung kemunculan bobot A, B, C pada mapel untuk setiap sumNilai
        sumNilai.forEach(sn => {
          if (sn[Object.keys(sn)[x+1]] >= 90) {
            bobotTemp[0]++;
          } else if (sn[Object.keys(sn)[x+1]] >= 85) {
            bobotTemp[1]++;
          } else if (sn[Object.keys(sn)[x+1]] >= 80) {
            bobotTemp[2]++;
          } else if (sn[Object.keys(sn)[x+1]] >= 75) {
            bobotTemp[3]++;
          } else if (sn[Object.keys(sn)[x+1]] >= 70) {
            bobotTemp[4]++;
          } else {
            bobotTemp[5]++;
          }
        });
        
        for (const mpl of mapel) {
          const freqData = [
            { mapel_id: mpl.id, bobot: "A", p_no: 1, p_yes: bobotTemp[0] },
            { mapel_id: mpl.id, bobot: "A-", p_no: 1, p_yes: bobotTemp[1] },
            { mapel_id: mpl.id, bobot: "B+", p_no: 1, p_yes: bobotTemp[2] },
            { mapel_id: mpl.id, bobot: "B", p_no: 1, p_yes: bobotTemp[3] },
            { mapel_id: mpl.id, bobot: "B-", p_no: 1, p_yes: bobotTemp[4] },
            { mapel_id: mpl.id, bobot: "CDE", p_no: 1, p_yes: bobotTemp[5] }
          ];
          await NbIpaV3FreqModel.bulkCreate(freqData);
        }
      }

    });

  } catch (error) {
    throw new Error(error.message);
  }

}

export const getAllNbIpaV3Data = async (req, res) => {
  try {
    const data = await NbIpaV3MapelModel.findAll({
      include: [
        {
          model: NbIpaV3FreqModel,
          as: 'nb_ipa_v3_freq_key'
        },
        {
          model: JurusanModel,
          as: 'nb_ipa_v3_mapel_key'
        },
      ],
      raw: true,
    }); // Ganti dengan method yang sesuai untuk mengambil data dari model
    res.status(200).json({
      message: "Data NbIpaV3Model berhasil diambil",
      data: data
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data NbIpaV3Model",
      error: error.message
    });
  }
};
