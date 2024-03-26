import { Sequelize } from "sequelize";
import  { JurusanModel, RumpunModel, UnivModel } from "../models/CollegeModel.js"
import { SiswaIpaModel } from "../models/IpaModel.js";

export const findOrCreateCollege = async (univ, jrsn, rmpn) => {

  let jurusan_id = 1;
  let univ_id = 1;
  let rumpun_id = 1;
  
  // Cari apakah data.rumpun ada di tabel rumpun
  if (rmpn !== null) { // Jika param rumpun tidak null
    const rumpun = await RumpunModel.findOne({ // Cari rumpun yang sama
      where: {
        rumpun: rmpn
      }
    });
    rumpun_id = rumpun ? rumpun.id : (await RumpunModel.create({
      rumpun: rmpn
    })).id;
  }

  // Cari apakah data.jrsn ada di tabel jurusan
  if (jrsn !== null) { // Jika param jrsn tidak null
    const jurusan = await JurusanModel.findOne({ // Cari jrsn yang sama
      where: {
        jurusan: jrsn
      }
    });
    jurusan_id = jurusan ? jurusan.id : (await JurusanModel.create({
      jurusan: jrsn,
      rumpun_id: rumpun_id
    })).id;
  }

  // Cari apakah data.univ ada di tabel universitas
  if (univ !== null) { // Jika param univ tidak null
    const universitas = await UnivModel.findOne({ // Cari univ yang sama
      where: {
        universitas: univ
      }
    });
    univ_id = universitas ? universitas.id : (await UnivModel.create({
      universitas: univ
    })).id;
  }

  return { jurusan_id, univ_id, rumpun_id };

};


export const getAllCollege = async (req, res) => {
  try {
    const jurusanData = await JurusanModel.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 1 // Blacklist jurusan_id yang nilainya 1
        }
      },
      include: [
        {
          model: SiswaIpaModel,
          as: 'jurusan_ipa_key',
          attributes: ['id'],
          include: [
            {
              model: UnivModel,
              as: 'univ_ipa_key',
              attributes: ['universitas']
            },
            {
              model: RumpunModel,
              as: 'rumpun_ipa_key',
              attributes: ['rumpun']
            },
          ],
        },
      ],
      group: ['jurusan', 'jurusan_ipa_key.id'] // Menambahkan 'jurusan_ipa_key.id' ke dalam GROUP BY
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