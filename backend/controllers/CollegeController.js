import { Sequelize } from "sequelize";
import  { JurusanModel, UniversitasModel } from "../models/CollegeModel.js"
import { SiswaModel } from "../models/DataSiswaModel.js";

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