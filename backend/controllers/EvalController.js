import { Sequelize } from "sequelize";
import { SiswaModel, SummaryModel } from "../models/DataSiswaModel.js";
import { EvalDataFreqModel, EvalDataMapelModel } from "../models/EvalModel.js";
import { JurusanModel } from "../models/CollegeModel.js";
import { DatasetMapelModel } from "../models/DatasetModel.js";

export const createTrainingData = async (req, res) => {
  try {
    
    let freqError = true;

    while (freqError) {
      await EvalDataMapelModel.destroy({ where: {} });
      await setMapelTable(res);
      freqError = await setFreqTable(res);
    }

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
      const dataset_mapel = [];
    
      for (let i = 1; i <= 15; i++) {
        dataset_mapel.push({
          jurusan_id: d.id,
          x: i,
          total_p_yes: 0,
          total_p_no: 0
        });
      }
    
      mapelTemp.push(dataset_mapel);
    });
    
    // Menggunakan bulkCreate untuk menambahkan baris-baris ke dalam tabel EvalDataMapelModel
    mapelTemp.forEach(async (dataset_mapel) => {
      await DatasetMapelModel.bulkCreate(dataset_mapel);
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
      for (let x_id = 1; x_id <= 15; x_id++) {
        
        const bobotTemp = [1, 1, 1, 1, 1, 1];

        // Mengambil parent dari tiap mapel dengan jurusan_id dan mapel (x) tertentu
        const mapel = await EvalDataMapelModel.findAll({
          where: {
            jurusan_id: j.id,
            x: x_id
          },
          raw: true,
        });

        if(mapel.length==0){
          return true;
        }
        
        // Menghitung kemunculan bobot A, B, C pada mapel untuk setiap sumNilai
        sumNilai.forEach(sn => {
          if (sn[Object.keys(sn)[x_id+1]] >= 90) {
            bobotTemp[0]++;
          } else if (sn[Object.keys(sn)[x_id+1]] >= 85) {
            bobotTemp[1]++;
          } else if (sn[Object.keys(sn)[x_id+1]] >= 80) {
            bobotTemp[2]++;
          } else if (sn[Object.keys(sn)[x_id+1]] >= 75) {
            bobotTemp[3]++;
          } else if (sn[Object.keys(sn)[x_id+1]] >= 70) {
            bobotTemp[4]++;
          } else {
            bobotTemp[5]++;
          }
        });

        await EvalDataMapelModel.update(
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
        for (const mpl of mapel) {
          const freq = [
            { mapel_id: mpl.id, bobot: "A", p_no: 1, p_yes: bobotTemp[0] },
            { mapel_id: mpl.id, bobot: "A-", p_no: 1, p_yes: bobotTemp[1] },
            { mapel_id: mpl.id, bobot: "B+", p_no: 1, p_yes: bobotTemp[2] },
            { mapel_id: mpl.id, bobot: "B", p_no: 1, p_yes: bobotTemp[3] },
            { mapel_id: mpl.id, bobot: "B-", p_no: 1, p_yes: bobotTemp[4] },
            { mapel_id: mpl.id, bobot: "CDE", p_no: 1, p_yes: bobotTemp[5] }
          ]
          await EvalDataFreqModel.bulkCreate(freq);
        }
      
      }

    };

    return false;

  } catch (error) {
    throw new Error(error.message);
  }

}

