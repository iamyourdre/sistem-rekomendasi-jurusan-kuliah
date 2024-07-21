import { Sequelize } from "sequelize";
import { JurusanModel, UniversitasModel } from "../models/CollegeModel.js";
import { SiswaModel } from "../models/DataSiswaModel.js";

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

export const resetDataset = async () => {
  try {

    await JurusanModel.destroy({ where: {} });
    await UniversitasModel.destroy({ where: {} });
    
    if (!await JurusanModel.findOne({ where: { id: 1 } })) {
      await JurusanModel.create({
        id: 1,
        jurusan: "-",
      });
    }
    
    if (!await UniversitasModel.findOne({ where: { id: 1 } })) {
      await UniversitasModel.create({
        id: 1,
        universitas: "-"
      });
    }

    return true;
  } catch (error) {
    return error;
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
      raw: true,
    })) return true

    return false;

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: error.message
    });
  }
};

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
