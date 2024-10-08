import { Sequelize } from "sequelize";
import { SiswaModel, SummaryModel } from "../models/DataSiswaModel.js";
import { DatasetMapelModel, DatasetFreqModel } from "../models/DatasetModel.js";
import { JurusanModel, UniversitasModel } from "../models/CollegeModel.js";
import { convertToGrade } from "./UtilsController.js";


export const createTrainingData = async (req, res) => {
  try {
    
    await DatasetMapelModel.destroy({ where: {} });
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
    });
    
    const mapelTemp = []; // Membuat objek untuk menyimpan jumlah data dalam masing-masing rentang

    // Membuat tabel mapel untuk setiap jurusan
    jurusan.forEach((d) => {
      const dataset_mapel = [];
    
      for (let i = 1; i <= 14; i++) {
        dataset_mapel.push({
          jurusan_id: d.id,
          x: i,
          total_p_yes: 0,
          total_p_no: 0
        });
      }
    
      mapelTemp.push(dataset_mapel);
    });
    
    // Menggunakan Promise.all untuk menambahkan baris-baris ke dalam tabel DatasetMapelModel
    await Promise.all(mapelTemp.map(async (dataset_mapel) => {
      await DatasetMapelModel.bulkCreate(dataset_mapel);
    }));

  } catch (error) {
    throw new Error(error.message);
  }
};

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
    for (const j of jurusan) {

      // Ambil semua summary nilai mapel terkait
      const sumNilai = await SummaryModel.findAll({
        include: [
          {
            model: SiswaModel,
            as: 'summary_key',
            where: {
              jurusan_id: j.id,
            },
          },
        ],
        raw: true,
      });

      // Melakukan iterasi untuk setiap mapel
      for (let x_id = 1; x_id <= 14; x_id++) {
        
        const bobotTemp = [1, 1, 1, 1, 1, 1];

        // Mengambil parent dari tiap mapel dengan jurusan_id dan mapel (x) tertentu
        const mapel = await DatasetMapelModel.findOne({
          where: {
            jurusan_id: j.id,
            x: x_id
          },
          raw: true,
        });
        
        // Menghitung kemunculan bobot A, B, C pada mapel untuk setiap sumNilai
        sumNilai.forEach(sn => {
          if (sn[Object.keys(sn)[x_id+1]] >= 90) {
            bobotTemp[0]++;
          } else if (sn[Object.keys(sn)[x_id+1]] >= 85) {
            bobotTemp[0]++;
            bobotTemp[1]++;
          } else if (sn[Object.keys(sn)[x_id+1]] >= 80) {
            bobotTemp[0]++;
            bobotTemp[1]++;
            bobotTemp[2]++;
          } else if (sn[Object.keys(sn)[x_id+1]] >= 75) {
            bobotTemp[0]++;
            bobotTemp[1]++;
            bobotTemp[2]++;
            bobotTemp[3]++;
          } else if (sn[Object.keys(sn)[x_id+1]] >= 70) {
            bobotTemp[0]++;
            bobotTemp[1]++;
            bobotTemp[2]++;
            bobotTemp[3]++;
            bobotTemp[4]++;
          } else {
            bobotTemp[0]++;
            bobotTemp[1]++;
            bobotTemp[2]++;
            bobotTemp[3]++;
            bobotTemp[4]++;
            bobotTemp[5]++;
          }
        });

        await DatasetMapelModel.update(
          {
            total_p_yes: bobotTemp[0]+bobotTemp[1]+bobotTemp[2]+bobotTemp[3]+bobotTemp[4]+bobotTemp[5],
            total_p_no: 6
          },
          {
            where: {
              jurusan_id: j.id,
              x: x_id
            }
          }
        );
        
        // Membuat frequency
        const freq = [
          { mapel_id: mapel.id, bobot: "A", p_no: 1, p_yes: bobotTemp[0] },
          { mapel_id: mapel.id, bobot: "A-", p_no: 1, p_yes: bobotTemp[1] },
          { mapel_id: mapel.id, bobot: "B+", p_no: 1, p_yes: bobotTemp[2] },
          { mapel_id: mapel.id, bobot: "B", p_no: 1, p_yes: bobotTemp[3] },
          { mapel_id: mapel.id, bobot: "B-", p_no: 1, p_yes: bobotTemp[4] },
          { mapel_id: mapel.id, bobot: "CDE", p_no: 1, p_yes: bobotTemp[5] }
        ]
        await DatasetFreqModel.bulkCreate(freq);
      
      }

    };

  } catch (error) {
    throw new Error(error.message);
  }

}

export const naiveBayesClassifier = async (req, res) => {
  try {
    
    const { x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14 } = req.body;

    const jurusan = await JurusanModel.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
        }
      }
    });

    // Mengkonversi input nilai menjadi bentuk bobot
    const myNilai = [
      convertToGrade(x1),
      convertToGrade(x2),
      convertToGrade(x3),
      convertToGrade(x4),
      convertToGrade(x5),
      convertToGrade(x6),
      convertToGrade(x7),
      convertToGrade(x8),
      convertToGrade(x9),
      convertToGrade(x10),
      convertToGrade(x11),
      convertToGrade(x12),
      convertToGrade(x13),
      convertToGrade(x14),
    ];

    const probData = [];
    // const probMapel = [];

    // Membuat perbandingan probabilitas untuk tiap-tiap jurusan berdasarkan nilai rapor yang diinput
    await Promise.all(jurusan.map(async (j) => {
      let p_yes = 1;
      let p_no = 1;
      for (let x = 1; x <= 14; x++) {
        const dataset_mapel = await DatasetMapelModel.findOne({
          where: { jurusan_id: j.id, x: x },
          include: [{
            model: DatasetFreqModel,
            as: 'dataset_freq_key',
            where: { bobot: myNilai[x-1] || "CDE" },
          }],
          raw: true
        });
        // probMapel.push({
        //   x: x,
        //   bobot: myNilai[x-1],
        //   p: {
        //     yes: dataset_mapel.total_p_yes,
        //     no: dataset_mapel.total_p_no,
        //     total_yes: dataset_mapel['dataset_freq_key.p_yes'],
        //     total_no: dataset_mapel['dataset_freq_key.p_no'],
        //   }
        // });
        p_yes *= (dataset_mapel['dataset_freq_key.p_yes'] / dataset_mapel.total_p_yes);
        p_no *= (dataset_mapel['dataset_freq_key.p_no'] / dataset_mapel.total_p_no);
      }
      const jurusanData = await JurusanModel.findOne({ where: { id: j.id } });
      const summaryData = await SiswaModel.findAll({
        where: { jurusan_id: j.id },
        include: [
          {
            model: JurusanModel,
            as: 'jurusan_key',
            where: { id: j.id },
            attributes: ['jurusan']
          },
          {
            model: UniversitasModel,
            as: 'univ_key',
            attributes: ['universitas']
          },
          {
            model: SummaryModel,
            as: 'summary_key',
          }
        ],
      });

      // Menambahkan nilai bobot huruf ke dalam summary_key
      let grade = [];
      summaryData.forEach((data) => {
        data.summary_key.forEach((summary) => {
          grade.push({
            mean_PABP: convertToGrade(summary.mean_PABP),
            mean_PPKN: convertToGrade(summary.mean_PPKN),
            mean_B_IND: convertToGrade(summary.mean_B_IND),
            mean_MTK_W: convertToGrade(summary.mean_MTK_W),
            mean_S_IND: convertToGrade(summary.mean_S_IND),
            mean_BING_W: convertToGrade(summary.mean_BING_W),
            mean_S_BUD: convertToGrade(summary.mean_S_BUD),
            mean_PJOK: convertToGrade(summary.mean_PJOK),
            mean_PKWU: convertToGrade(summary.mean_PKWU),
            mean_MTK_T: convertToGrade(summary.mean_MTK_T),
            mean_BIO: convertToGrade(summary.mean_BIO),
            mean_FIS: convertToGrade(summary.mean_FIS),
            mean_KIM: convertToGrade(summary.mean_KIM),
            mean_EKO: convertToGrade(summary.mean_EKO),
          });
        });
      });

      probData.push({
        jurusan: jurusanData,
        p_yes: p_yes,
        p_no: p_no,
        ref: [summaryData, grade]
      });
    }));
    probData.sort((a, b) => a.jurusan.id - b.jurusan.id);

    // Membuat output probabilitas final untuk tiap jurusan
    res.status(200).json({ probData });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};