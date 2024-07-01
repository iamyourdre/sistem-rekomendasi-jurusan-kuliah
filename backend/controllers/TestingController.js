import { Sequelize } from "sequelize";
import { SiswaModel, SummaryModel } from "../models/DataSiswaModel.js";
import { TestingMapelModel, TestingFreqModel } from "../models/TestingModel.js";
import { JurusanModel, UniversitasModel } from "../models/CollegeModel.js";
import { convertToGrade } from "./UtilsController.js";
import distance from 'euclidean-distance';

let isProcessing = false;

export const testingByLOOCV = async (req, res) => {

  if (isProcessing) {
    res.status(400).json({ message: "Pemrosesan sudah berjalan." });
    return;
  }

  isProcessing = true;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Memastikan header dikirimkan ke client

  try {
    const dataLength = await SiswaModel.count({
      include: [
        {
          model: JurusanModel,
          as: 'jurusan_key',
          where: {
            id: {
              [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
            }
          },
        },
        {
          model: UniversitasModel,
          as: 'univ_key',
        },
      ],
    });

    let iter = 0;
    let counter = 0;
    let subcounter = 0;

    while (iter < dataLength) {
      let testSet;
      let trainingSet;

      await TestingMapelModel.destroy({ where: {} });
      await setMapelTable(res);
      const dataset = await setFreqTable(counter, subcounter, res);

      testSet = dataset.testSet;
      trainingSet = dataset.trainingSet;
      counter = dataset.counter;
      subcounter = dataset.subcounter;

      const requestBody = {
        id: testSet[0].siswa_id,
        x1: Object.values(testSet[0])[2],
        x2: Object.values(testSet[0])[3],
        x3: Object.values(testSet[0])[4],
        x4: Object.values(testSet[0])[5],
        x5: Object.values(testSet[0])[6],
        x6: Object.values(testSet[0])[7],
        x7: Object.values(testSet[0])[8],
        x8: Object.values(testSet[0])[9],
        x9: Object.values(testSet[0])[10],
        x10: Object.values(testSet[0])[11],
        x11: Object.values(testSet[0])[12],
        x12: Object.values(testSet[0])[13],
        x13: Object.values(testSet[0])[14],
        x14: Object.values(testSet[0])[15],
      };

      const response = await naiveBayesClassifier(requestBody);
      const sortedProbData = response.sort((a, b) => b.p_yes - a.p_yes);

      const eucDistResult = await eucDist(testSet[0], sortedProbData);

      const logEntry = {
        iter: iter,
        testSet: testSet,
        trainingSet: trainingSet,
        probData: sortedProbData,
        eucDistResult: eucDistResult
      };

      res.write(`data: ${JSON.stringify(logEntry)}\n\n`);
      iter++;
    }

    isProcessing = false;
    res.write('event: done\ndata: Pengujian selesai!\n\n');
    res.end();

  } catch (error) {
    res.write(`event: error\ndata: ${JSON.stringify({ message: "Pengujian gagal!", error: error.message })}\n\n`);
    res.end();
  }
};


async function eucDist(my_score, probData) {

  let shortestSimilarity = [];
  let shortestScore = 999;
  probData.forEach(data => {
    data.ref[0].forEach(ref => {
      ref.summary_key.forEach(score => {
        const dist = distance([
          Object.values(my_score)[2], 
          Object.values(my_score)[3], 
          Object.values(my_score)[4], 
          Object.values(my_score)[5], 
          Object.values(my_score)[6], 
          Object.values(my_score)[7], 
          Object.values(my_score)[8], 
          Object.values(my_score)[9], 
          Object.values(my_score)[10], 
          Object.values(my_score)[11], 
          Object.values(my_score)[12], 
          Object.values(my_score)[13], 
          Object.values(my_score)[14], 
          Object.values(my_score)[15], 
        ], [
          Object.values(Object.values(score)[0])[2], 
          Object.values(Object.values(score)[0])[3], 
          Object.values(Object.values(score)[0])[4], 
          Object.values(Object.values(score)[0])[5], 
          Object.values(Object.values(score)[0])[6], 
          Object.values(Object.values(score)[0])[7], 
          Object.values(Object.values(score)[0])[8], 
          Object.values(Object.values(score)[0])[9], 
          Object.values(Object.values(score)[0])[10], 
          Object.values(Object.values(score)[0])[11], 
          Object.values(Object.values(score)[0])[12], 
          Object.values(Object.values(score)[0])[13], 
          Object.values(Object.values(score)[0])[14], 
          Object.values(Object.values(score)[0])[15], 
        ])

        // jika jarak euc dist sama dengan rekor shortestScore, maka cek tahun angkatan
        if(dist == shortestScore){ 
          if(shortestSimilarity[0].akt_thn<ref.akt_thn){
            shortestSimilarity = [];
            shortestSimilarity.push(ref); // gunakan angkatan paling baru karena lebih relevan
            shortestScore = dist;
          }
        } else if(dist < shortestScore){
          shortestSimilarity = [];
          shortestSimilarity.push(ref); // gunakan angkatan paling baru karena lebih relevan
          shortestScore = dist;
        }
      });
    });
  });
  return shortestSimilarity;
}

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
    
    // Menggunakan Promise.all untuk menambahkan baris-baris ke dalam tabel TestingMapelModel
    await Promise.all(mapelTemp.map(async (dataset_mapel) => {
      await TestingMapelModel.bulkCreate(dataset_mapel);
    }));

  } catch (error) {
    throw new Error(error.message);
  }
};

export const setFreqTable = async (counter, subcounter, res) => {
  
  let testSet = [];
  let trainingSet = [];

  let indexJ = 0;

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
            include: [
              {
                model: JurusanModel,
                as: 'jurusan_key',
              },
            ]
          },
        ],
        raw: true,
      });

      // sumNilai adalah data nilai untuk setiap iterasi jurusan
      // mengambil 1 data dari sumNilai sebagai data testing
      if(counter == indexJ && sumNilai.length==1){
        subcounter = 0;
        testSet.push(...sumNilai.splice(subcounter, 1));
      } else if(counter == indexJ && sumNilai.length>1) {
        testSet.push(...sumNilai.splice((0, subcounter), 1));
        if(subcounter < sumNilai.length){
          subcounter++;
        } else {
          subcounter = 0;
        }
      }

      // menyimpan sisa data sumNilai sebagai data uji
      trainingSet.push(sumNilai);

      // Melakukan iterasi untuk setiap mapel
      for (let x_id = 1; x_id <= 14; x_id++) {
        
        const bobotTemp = [1, 1, 1, 1, 1, 1];

        // Mengambil parent dari tiap mapel dengan jurusan_id dan mapel (x) tertentu
        const mapel = await TestingMapelModel.findAll({
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

        await TestingMapelModel.update(
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
          await TestingFreqModel.bulkCreate(freq);
        }
      
      }
      
      indexJ++;
    };
    
    if(subcounter==0){
      counter++;
    }
    return {testSet, trainingSet, counter, subcounter};

  } catch (error) {
    throw new Error(error.message);
  }

}

// Bagaimana cara agar naiveBayesClassifier dapat mengecualikan testSet dari dataSet?
export const naiveBayesClassifier = async (requestBody) => {
  try {
    const { id, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14 } = requestBody;

    const jurusan = await JurusanModel.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
        }
      }
    });

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
    ];

    const probData = [];

    await Promise.all(jurusan.map(async (j) => {
      // const probMapel = [];
      let p_yes = 1;
      let p_no = 1;
      for (let x = 1; x <= 14; x++) {
        const mapel = await TestingMapelModel.findOne({
          where: { jurusan_id: j.id, x: x },
          include: [{
            model: TestingFreqModel,
            as: 'testing_freq_key',
            where: { bobot: inputNilai[x-1] || "CDE" },
          }],
          raw: true
        });
        p_yes *= (mapel['testing_freq_key.p_yes'] / mapel.total_p_yes);
        p_no *= (mapel['testing_freq_key.p_no'] / mapel.total_p_no);
      }
      const jurusanData = await JurusanModel.findOne({ where: { id: j.id } });
      const summaryData = await SiswaModel.findAll({
        where: { 
          jurusan_id: j.id,
          id: {
            [Sequelize.Op.ne]: id
          }
        },
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

    return probData;

  } catch (error) {
    throw new Error(error.message);
  }
};
