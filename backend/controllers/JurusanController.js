import JurusanModel from "../models/JurusanModel.js"

export const findOrCreateJurusan = async (jrsn, rmpn) => {

  // Cari apakah data.JRSN ada di tabel jurusan
  if (jrsn !== null){ // Hanya memproses data yang tidak null
    const jurusan = await JurusanModel.findOne({
      where: {
        jurusan: jrsn
      }
    });
    if(!jurusan) { // Jika jurusan unik, maka buat data jurusan baru
      const createdJurusan = await JurusanModel.create({
        jurusan: jrsn,
        rumpun: rmpn || "-",
      });
      return createdJurusan.id;
    } else {
      return jurusan.id;
    }
  }
  return 1;
};