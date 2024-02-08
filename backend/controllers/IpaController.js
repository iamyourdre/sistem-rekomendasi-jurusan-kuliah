import { SiswaIpaModel, NilaiIpaModel } from "../models/IpaModel.js";
import readXlsxFile from "read-excel-file/node";
import path from "path";
import { fileURLToPath } from "url";
import { createJurusan } from "./JurusanController.js";
import JurusanModel from "../models/JurusanModel.js";

export const upload = async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).send("Silakan unggah file Excel!");
    }

    // Direktori untuk menyimpan file upload
    const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..\\assets\\uploads\\");

    // Membaca file Excel
    readXlsxFile(uploadDir + req.file.filename).then(async (rows) => {
        
      let dataset = [];
      const headerRow = rows.shift();

      // Mengisi dataset dengan data dari file Excel
      rows.forEach((row, rowIndex) => {
        if (rows[(rowIndex + 3)] && rows[(rowIndex + 3)][1] !== undefined) {
          let datas = {
            NAMA: rows[(rowIndex + 3)][1],
            SEMESTER_1: {
              PABP: rows[(rowIndex + 3)][2],
              PPKN: rows[(rowIndex + 3)][3],
              B_IND: rows[(rowIndex + 3)][4],
              MTK_W: rows[(rowIndex + 3)][5],
              S_IND: rows[(rowIndex + 3)][6],
              BING_W: rows[(rowIndex + 3)][7],
              S_BUD: rows[(rowIndex + 3)][8],
              PJOK: rows[(rowIndex + 3)][9],
              PKWU: rows[(rowIndex + 3)][10],
              MTK_T: rows[(rowIndex + 3)][11],
              BIO: rows[(rowIndex + 3)][12],
              FIS: rows[(rowIndex + 3)][13],
              KIM: rows[(rowIndex + 3)][14],
              EKO: rows[(rowIndex + 3)][15],
              BING_T: rows[(rowIndex + 3)][16],
            },
            SEMESTER_2: {
              PABP: rows[(rowIndex + 3)][2+15],
              PPKN: rows[(rowIndex + 3)][3+15],
              B_IND: rows[(rowIndex + 3)][4+15],
              MTK_W: rows[(rowIndex + 3)][5+15],
              S_IND: rows[(rowIndex + 3)][6+15],
              BING_W: rows[(rowIndex + 3)][7+15],
              S_BUD: rows[(rowIndex + 3)][8+15],
              PJOK: rows[(rowIndex + 3)][9+15],
              PKWU: rows[(rowIndex + 3)][10+15],
              MTK_T: rows[(rowIndex + 3)][11+15],
              BIO: rows[(rowIndex + 3)][12+15],
              FIS: rows[(rowIndex + 3)][13+15],
              KIM: rows[(rowIndex + 3)][14+15],
              EKO: rows[(rowIndex + 3)][15+15],
              BING_T: rows[(rowIndex + 3)][16+15],
            },
            SEMESTER_3: {
              PABP: rows[(rowIndex + 3)][2+32],
              PPKN: rows[(rowIndex + 3)][3+32],
              B_IND: rows[(rowIndex + 3)][4+32],
              MTK_W: rows[(rowIndex + 3)][5+32],
              S_IND: rows[(rowIndex + 3)][6+32],
              BING_W: rows[(rowIndex + 3)][7+32],
              S_BUD: rows[(rowIndex + 3)][8+32],
              PJOK: rows[(rowIndex + 3)][9+32],
              PKWU: rows[(rowIndex + 3)][10+32],
              MTK_T: rows[(rowIndex + 3)][11+32],
              BIO: rows[(rowIndex + 3)][12+32],
              FIS: rows[(rowIndex + 3)][13+32],
              KIM: rows[(rowIndex + 3)][14+32],
              EKO: rows[(rowIndex + 3)][15+32],
            },
            SEMESTER_4: {
              PABP: rows[(rowIndex + 3)][2+44],
              PPKN: rows[(rowIndex + 3)][3+44],
              B_IND: rows[(rowIndex + 3)][4+44],
              MTK_W: rows[(rowIndex + 3)][5+44],
              S_IND: rows[(rowIndex + 3)][6+44],
              BING_W: rows[(rowIndex + 3)][7+44],
              S_BUD: rows[(rowIndex + 3)][8+44],
              PJOK: rows[(rowIndex + 3)][9+44],
              PKWU: rows[(rowIndex + 3)][10+44],
              MTK_T: rows[(rowIndex + 3)][11+44],
              BIO: rows[(rowIndex + 3)][12+44],
              FIS: rows[(rowIndex + 3)][13+44],
              KIM: rows[(rowIndex + 3)][14+44],
              EKO: rows[(rowIndex + 3)][15+44],
            },
            SEMESTER_5: {
              PABP: rows[(rowIndex + 3)][2+58],
              PPKN: rows[(rowIndex + 3)][3+58],
              B_IND: rows[(rowIndex + 3)][4+58],
              MTK_W: rows[(rowIndex + 3)][5+58],
              S_IND: rows[(rowIndex + 3)][6+58],
              BING_W: rows[(rowIndex + 3)][7+58],
              S_BUD: rows[(rowIndex + 3)][8+58],
              PJOK: rows[(rowIndex + 3)][9+58],
              PKWU: rows[(rowIndex + 3)][10+58],
              MTK_T: rows[(rowIndex + 3)][11+58],
              BIO: rows[(rowIndex + 3)][12+58],
              FIS: rows[(rowIndex + 3)][13+58],
              KIM: rows[(rowIndex + 3)][14+58],
              EKO: rows[(rowIndex + 3)][15+58],
            },
            TAHUN: rows[(rowIndex + 3)][74],
            UNIV: rows[(rowIndex + 3)][75],
            JRSN: rows[(rowIndex + 3)][76],
            RUMPUN: rows[(rowIndex + 3)][77],
          };
          dataset.push(datas);
        }
      });


      try {


        // Membuat data siswa dan data nilai untuk setiap siswa
        const nilaiPromises = dataset.map(async (data) => {
          let jurusan_id = await createJurusan(data);
          
          // if (data.JRSN != null && !await JurusanModel.findOne({ // Cari apakah data.JRSN ada di tabel jurusan
          //   where: {
          //     jurusan: data.JRSN
          //   }
          // })) {
          //   // Jika jurusan belum ada, buat jurusan baru
          //   const createdJurusan = await JurusanModel.create({
          //     jurusan: data.JRSN,
          //     rumpun: data.RUMPUN,
          //   });
          //   jurusan_id = createdJurusan.id;
          // }
          
          const createdSiswa = await SiswaIpaModel.create({
            nama: data.NAMA || "-",
            akt_thn: data.TAHUN  || 0,
            univ: data.UNIV  || "-",
            jurusan_id: jurusan_id
          });
        
          // Buat loop untuk setiap semester
          for (let i = 1; i <= 5; i++) {
            const nilaiSemester = data[`SEMESTER_${i}`]; // Ambil data nilai untuk semester tertentu

            // Buat data nilai untuk setiap semester
            const nilaiData = {
              siswa_id: createdSiswa.id,
              semester: i, // Ganti dengan semester yang sesuai
              PABP: nilaiSemester.PABP || 0,
              PPKN: nilaiSemester.PPKN || 0,
              B_IND: nilaiSemester.B_IND || 0,
              MTK_W: nilaiSemester.MTK_W || 0,
              S_IND: nilaiSemester.S_IND || 0,
              BING_W: nilaiSemester.BING_W || 0,
              S_BUD: nilaiSemester.S_BUD || 0,
              PJOK: nilaiSemester.PJOK || 0,
              PKWU: nilaiSemester.PKWU || 0,
              MTK_T: nilaiSemester.MTK_T || 0,
              BIO: nilaiSemester.BIO || 0,
              FIS: nilaiSemester.FIS || 0,
              KIM: nilaiSemester.KIM || 0,
              EKO: nilaiSemester.EKO || 0,
            };

            // Tambahkan BING_T jika ada di semester 1 atau 2
            nilaiData.BING_T = (i === 1 || i === 2 ? nilaiSemester.BING_T : 0)

            await NilaiIpaModel.create(nilaiData);
          }
        });
        
        await Promise.all(nilaiPromises);
      
        res.status(200).send({
          message: "Berhasil mengunggah file: " + req.file.originalname,
        });

      } catch (error) {
        res.status(500).send({
          message: "Gagal mengimpor data ke database!",
          error: error.message,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Tidak dapat mengunggah file: " + req.file.originalname,
    });
  }
};
export const getAllIpa = async (req, res) => {
  try {
    const siswaData = await SiswaIpaModel.findAll({
      include: [
        {
          model: NilaiIpaModel,
          as: 'nilai_ipa_s',
        },
      ],
    });

    // Mendapatkan data jurusan berdasarkan jurusan_id dari masing-masing siswa
    const jurusanDataPromises = siswaData.map(async (siswa) => {
      const jurusan = await JurusanModel.findOne({
        where: { id: siswa.jurusan_id }
      });
      return jurusan ? jurusan.toJSON() : null;
    });

    const jurusanData = await Promise.all(jurusanDataPromises);

    // Menambahkan data jurusan ke masing-masing objek siswa dalam hasil query
    siswaData.forEach((siswa, index) => {
      siswa.dataValues.jurusan = jurusanData[index];
    });

    res.status(200).json({
      message: "Berhasil mendapatkan data siswa beserta nilai IPA dan jurusan",
      data: siswaData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mendapatkan data siswa beserta nilai IPA dan jurusan",
      error: error.message,
    });
  }
};



export const deleteAllIpa = async (req, res) => {
  try {
    // Hapus semua data dalam tabel NilaiIpaModel
    await NilaiIpaModel.destroy({ where: {} });

    // Hapus semua data dalam tabel SiswaIpaModel
    await SiswaIpaModel.destroy({ where: {} });

    res.status(200).json({
      message: "Berhasil menghapus semua data dalam tabel",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus semua data dalam tabel",
      error: error.message,
    });
  }
};