import { SiswaModel, NilaiModel, SummaryModel } from "../models/DataSiswaModel.js";
import readXlsxFile from "read-excel-file/node";
import path from "path";
import { fileURLToPath } from "url";
import { findOrCreateCollege, isDuplication, resetDataset } from "./UtilsController.js";

// Fungsi admin untuk mengupload file dataset Excel
export const uploadDataSiswa = async (req, res) => {
  try {

    // Mengecek apakah user meminta reset dataset sebelum menambahkan yang baru?
    req.body.reset === "y" ? await resetDataset(res) : null;

    // Mengecek apakah file Excel ada
    if (req.file === undefined) {
      return res.status(400).send("Silakan unggah file .xlsx!");
    }

    // Menyimpan file Excel ke direktori
    const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..\\assets\\uploads\\");

    // Membaca file Excel
    readXlsxFile(uploadDir + req.file.filename).then(async (rows) => {
        
      let dataset = [];
      const headerRow = rows.shift();

      // Mengambil nilai setiap dataset Excel ke datas dan memasukkannya ke array object dataset
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
              PABP: rows[(rowIndex + 3)][2+30],
              PPKN: rows[(rowIndex + 3)][3+30],
              B_IND: rows[(rowIndex + 3)][4+30],
              MTK_W: rows[(rowIndex + 3)][5+30],
              S_IND: rows[(rowIndex + 3)][6+30],
              BING_W: rows[(rowIndex + 3)][7+30],
              S_BUD: rows[(rowIndex + 3)][8+30],
              PJOK: rows[(rowIndex + 3)][9+30],
              PKWU: rows[(rowIndex + 3)][10+30],
              MTK_T: rows[(rowIndex + 3)][11+30],
              BIO: rows[(rowIndex + 3)][12+30],
              FIS: rows[(rowIndex + 3)][13+30],
              KIM: rows[(rowIndex + 3)][14+30],
              EKO: rows[(rowIndex + 3)][15+30],
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
          };
          dataset.push(datas);
        }
      });

      try {

        // Melakukan iterasi untuk setiap object pada dataset
        for (const data of dataset) {
          
          // Mengecek ketersediaan univ, dan jurusan atau membuat data baru apabila terdapat nilai yang unik
          const college = await findOrCreateCollege(data.UNIV, data.JRSN);

          // Mengecek duplikasi data untuk mencegah redundansi
          const isDupli = await isDuplication(data, college.univ_id, college.jurusan_id);
          
          // Apabila tidak ada redundansi, maka lakukan proses masukkan data ke database
          if (!isDupli) {

            const createdSiswa = await SiswaModel.create({
              nama: (data.NAMA || "-").toUpperCase(),
              akt_thn: data.TAHUN || 0,
              univ_id: college.univ_id,
              jurusan_id: college.jurusan_id,
            });

            let summaryNilai = {
              siswa_id: createdSiswa.id,
              total: 0,
              mean_PABP: 0,
              mean_PPKN: 0,
              mean_B_IND: 0,
              mean_MTK_W: 0,
              mean_S_IND: 0,
              mean_BING_W: 0,
              mean_S_BUD: 0,
              mean_PJOK: 0,
              mean_PKWU: 0,
              mean_MTK_T: 0,
              mean_BIO: 0,
              mean_FIS: 0,
              mean_KIM: 0,
              mean_EKO: 0,
              mean_BING_T: 0
            };
      
            for (let i = 1; i <= 5; i++) {

              const nilaiSemester = data[`SEMESTER_${i}`];

              // Memasukkan nilai mapel per semester ke database
              const nilaiData = {
                siswa_id: createdSiswa.id,
                semester: i,
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
                BING_T: (i === 1 || i === 2 ? nilaiSemester.BING_T : 0)
              };
              await NilaiModel.create(nilaiData);

              // Menghitung total nilai tiap mapel
              summaryNilai.mean_PABP += nilaiSemester.PABP || 0;
              summaryNilai.mean_PPKN += nilaiSemester.PPKN || 0;
              summaryNilai.mean_B_IND += nilaiSemester.B_IND || 0;
              summaryNilai.mean_MTK_W += nilaiSemester.MTK_W || 0;
              summaryNilai.mean_S_IND += nilaiSemester.S_IND || 0;
              summaryNilai.mean_BING_W += nilaiSemester.BING_W || 0;
              summaryNilai.mean_S_BUD += nilaiSemester.S_BUD || 0;
              summaryNilai.mean_PJOK += nilaiSemester.PJOK || 0;
              summaryNilai.mean_PKWU += nilaiSemester.PKWU || 0;
              summaryNilai.mean_MTK_T += nilaiSemester.MTK_T || 0;
              summaryNilai.mean_BIO += nilaiSemester.BIO || 0;
              summaryNilai.mean_FIS += nilaiSemester.FIS || 0;
              summaryNilai.mean_KIM += nilaiSemester.KIM || 0;
              summaryNilai.mean_EKO += nilaiSemester.EKO || 0;
              summaryNilai.mean_BING_T += (i === 1 || i === 2 ? nilaiSemester.BING_T : 0);
            }
            
            // Menghitung rata-rata nilai mapel
            let totalNilai = 0;
            for (let i = 2; i <= 15; i++) {
              totalNilai += summaryNilai[Object.keys(summaryNilai)[i]]; // Mengakses nilai mapel berdasarkan nama atribut
              summaryNilai[Object.keys(summaryNilai)[i]] /= 5; // Menghitung rata-rata nilai mapel
            }
            totalNilai += summaryNilai[Object.keys(summaryNilai)[16]];
            summaryNilai[Object.keys(summaryNilai)[16]] /= 2; // Menghitung rata-rata nilai BING_T
            summaryNilai.total = totalNilai; // Menyimpan total nilai ke dalam properti total

            // Memasukkan ringkasan rata-rata nilai ke database
            await SummaryModel.create(summaryNilai);

          }
        }
      
        res.status(200).json({
          message: "Dataset " + req.file.originalname +" berhasil diinput!",
        });

      } catch (error) {
        res.status(500).json({
          message: "Gagal menginput dataset ke database!",
          error: error.message,
        });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Dataset " + req.file.originalname +" gagal diimpor!",
      error: error.message,
    });
  }
};

