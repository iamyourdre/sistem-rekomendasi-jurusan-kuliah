import { Sequelize } from "sequelize";
import { JurusanModel, UniversitasModel } from "../models/CollegeModel.js";
import { NilaiModel, SiswaModel, SummaryModel } from "../models/DataSiswaModel.js";
import { DatasetFreqModel, DatasetMapelModel } from "../models/DatasetModel.js";

export const getDataset = async (req, res) => {
  try {
    const dataset = await DatasetMapelModel.findAll({
      include: [
        {
          model: DatasetFreqModel,
          as: 'dataset_freq_key'
        },
        {
          model: JurusanModel,
          as: 'dataset_mapel_key'
        },
      ],
      raw: true,
    });
    res.status(200).json({
      message: "Dataset berhasil diambil",
      data: dataset
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil dataset",
      error: error.message
    });
  }
};


export const getDataLength = async (req, res) => {
  try {
    const eligLength = await SiswaModel.count({
      include: [
        {
          model: JurusanModel,
          as: 'jurusan_key',
          where: {
            id: {
              [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
            }
          },
        }
      ],
    });
    const siswaLength = await SiswaModel.count({});
    const jurusanLength = await JurusanModel.count({});
    const univLength = await UniversitasModel.count({});
    
    res.status(200).json({
      siswaLength,
      jurusanLength,
      univLength,
      eligLength
    });    
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil dataset!",
      error: error.message,
    });
  }
};

export const resetDataset = async (res) => {
  try {

    await NilaiModel.destroy({ where: {} });
    await SiswaModel.destroy({ where: {} });
    await SummaryModel.destroy({ where: {} });

    return {
      success: true,
      message: "Berhasil menghapus semua dataset!",
    };
  } catch (error) {
    return {
      message: "Gagal menghapus semua dataset!",
      error: error.message,
    };
  }
};

export const findOrCreateCollege = async (univ, jrsn, rmpn) => {

  let jurusan_id = 1;
  let univ_id = 1;

  // Cari apakah data.jrsn ada di tabel jurusan
  if (jrsn !== null) { // Jika param jrsn tidak null
    const jurusan = await JurusanModel.findOne({ // Cari jrsn yang sama
      where: {
        jurusan: jrsn
      }
    });
    jurusan_id = jurusan ? jurusan.id : (await JurusanModel.create({
      jurusan: jrsn
    })).id;
  }

  // Cari apakah data.univ ada di tabel universitas
  if (univ !== null) { // Jika param univ tidak null
    const universitas = await UniversitasModel.findOne({ // Cari univ yang sama
      where: {
        universitas: univ
      }
    });
    univ_id = universitas ? universitas.id : (await UniversitasModel.create({
      universitas: univ
    })).id;
  }

  return { jurusan_id, univ_id };

};


export const getCollege = async (req, res) => {
  try {
    const jurusanData = await JurusanModel.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
        }
      },
      include: [
        {
          model: SiswaModel,
          as: 'jurusan_key',
          attributes: ['id'],
          include: [
            {
              model: UniversitasModel,
              as: 'univ_key',
              attributes: ['universitas']
            },
          ],
        },
      ],
      group: ['jurusan', 'jurusan_key.id'] // Menambahkan 'jurusan_key.id' ke dalam GROUP BY
    });
    
    res.status(200).json({
      data: jurusanData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getDataSiswa = async (req, res) => {
  try {
    const siswaData = await SiswaModel.findAll({
      include: [
        {
          model: JurusanModel,
          as: 'jurusan_key',
        },
        {
          model: UniversitasModel,
          as: 'univ_key',
        },
      ],
    });
    res.status(200).json({
      data: siswaData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Gagal mengambil dataset!",
      error: error.message,
    });
  }
};


export const getSiswaEligible = async (req, res) => {
  try {
    const siswaData = await SiswaModel.findAll({
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
    res.status(200).json({
      data: siswaData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Gagal mengambil dataset!",
      error: error.message,
    });
  }
};

export const isDuplication = async (data, u_id, j_id, res) => {
  try {
    // Cari data siswa berdasarkan nama, dan sertakan relasinya dengan nilai ipa
    if(await SiswaModel.findOne({
      where: { 
        nama: data.NAMA,
        univ_id: u_id || 1,
        jurusan_id: j_id || 1,
      },
      include: [{ 
        model: NilaiModel,
        where: {
          semester: 1,
          PABP: data['SEMESTER_1']['PABP'],
          PPKN: data['SEMESTER_1']['PPKN'],
          B_IND: data['SEMESTER_1']['B_IND'],
          MTK_W: data['SEMESTER_1']['MTK_W'],
          S_IND: data['SEMESTER_1']['S_IND'],
          BING_W: data['SEMESTER_1']['BING_W'],
          S_BUD: data['SEMESTER_1']['S_BUD'],
          PJOK: data['SEMESTER_1']['PJOK'],
          PKWU: data['SEMESTER_1']['PKWU'],
          MTK_T: data['SEMESTER_1']['MTK_T'],
          BIO: data['SEMESTER_1']['BIO'],
          FIS: data['SEMESTER_1']['FIS'],
          KIM: data['SEMESTER_1']['KIM'],
          EKO: data['SEMESTER_1']['EKO'],
          BING_T: data['SEMESTER_1']['BING_T'],
        },
        as: 'nilai_key' 
      }],
      raw: true,
    })) return true

    return false;

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Gagal melakukan operasi pengecekan duplikasi!",
    });
  }
};

// Function untuk mengkonversi nilai menjadi bentuk bobot
export function convertToGrade(score) {
  const numericScore = parseFloat(score)
  if (numericScore >= 90) {
    return "A";
  } else if (numericScore >= 85) {
    return "A-";
  } else if (numericScore >= 80) {
    return "B+";
  } else if (numericScore >= 75) {
    return "B";
  } else if (numericScore >= 70) {
    return "B-";
  } else {
    return "CDE";
  }
}
