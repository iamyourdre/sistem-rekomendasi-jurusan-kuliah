import JurusanModel from "../models/JurusanModel.js"

export const createJurusan = async (data) => {
  let jurusan_id = 0;

  if (data.JRSN != null && !await JurusanModel.findOne({ // Cari apakah data.JRSN ada di tabel jurusan
    where: {
      jurusan: data.JRSN
    }
  })) {
    // Jika jurusan belum ada, buat jurusan baru
    const createdJurusan = await JurusanModel.create({
      jurusan: data.JRSN,
      rumpun: data.RUMPUN,
    });
    jurusan_id = createdJurusan.id;
  }

  return jurusan_id;
};