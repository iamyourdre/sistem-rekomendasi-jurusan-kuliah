import { Sequelize } from "sequelize";
import { SiswaModel, SummaryModel } from "../models/DataSiswaModel.js";
import { DatasetMapelModel, DatasetFreqModel } from "../models/DatasetModel.js";
import { JurusanModel, UniversitasModel } from "../models/CollegeModel.js";
import { convertToGrade } from "./UtilsController.js";

export const naiveBayesClassifier = async (req, res) => {
  try {
    
    const { x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 } = req.body;

    const jurusan = await JurusanModel.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
        }
      }
    })

    // Mengkonversi input nilai menjadi bentuk bobot
    const inputNilai = [
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
      convertToGrade(x15)
    ];

    const probData = [];

    // Membuat perbandingan probabilitas untuk tiap-tiap jurusan berdasarkan nilai rapor yang diinput
    await Promise.all(jurusan.map(async (j) => {
      const probMapel = [];
      let p_yes = 1;
      let p_no = 1;
      for (let x = 1; x <= 15; x++) {
        const mapel = await DatasetMapelModel.findOne({
          where: { jurusan_id: j.id, x: x },
          include: [{
            model: DatasetFreqModel,
            as: 'dataset_freq_key',
            where: { bobot: inputNilai[x-1] || "CDE" },
          }],
          raw: true
        });
        probMapel.push({
          x: x,
          bobot: inputNilai[x-1],
          p: {
            yes: mapel.total_p_yes,
            no: mapel.total_p_no,
            total_yes: mapel['dataset_freq_key.p_yes'],
            total_no: mapel['dataset_freq_key.p_no'],
          }
        });
        p_yes *= (mapel['dataset_freq_key.p_yes'] / mapel.total_p_yes)
        p_no *= (mapel['dataset_freq_key.p_no'] / mapel.total_p_no )
      }
      probData.push({
        jurusan: await JurusanModel.findOne({
          where: {id: j.id},
        }),
        p_yes: p_yes,
        p_no: p_no,
        reference: await SiswaModel.findAll({
          where: {
            jurusan_id: j.id
          },
          include: [
            {
              model: JurusanModel,
              as: 'jurusan_key',
              where: {
                id: j.id
              },
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
        })
      });
    }));
    probData.sort((a, b) => a.jurusan_id - b.jurusan_id);

    // Membuat output probabilitas final untuk tiap jurusan
    res.status(200).json({ probData });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

