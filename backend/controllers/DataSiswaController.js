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
            },
            SEMESTER_2: {
              PABP: rows[(rowIndex + 3)][16],
              PPKN: rows[(rowIndex + 3)][17],
              B_IND: rows[(rowIndex + 3)][18],
              MTK_W: rows[(rowIndex + 3)][19],
              S_IND: rows[(rowIndex + 3)][20],
              BING_W: rows[(rowIndex + 3)][21],
              S_BUD: rows[(rowIndex + 3)][22],
              PJOK: rows[(rowIndex + 3)][23],
              PKWU: rows[(rowIndex + 3)][24],
              MTK_T: rows[(rowIndex + 3)][25],
              BIO: rows[(rowIndex + 3)][26],
              FIS: rows[(rowIndex + 3)][27],
              KIM: rows[(rowIndex + 3)][28],
              EKO: rows[(rowIndex + 3)][29],
            },
            SEMESTER_3: {
              PABP: rows[(rowIndex + 3)][30],
              PPKN: rows[(rowIndex + 3)][31],
              B_IND: rows[(rowIndex + 3)][32],
              MTK_W: rows[(rowIndex + 3)][33],
              S_IND: rows[(rowIndex + 3)][34],
              BING_W: rows[(rowIndex + 3)][35],
              S_BUD: rows[(rowIndex + 3)][36],
              PJOK: rows[(rowIndex + 3)][37],
              PKWU: rows[(rowIndex + 3)][38],
              MTK_T: rows[(rowIndex + 3)][39],
              BIO: rows[(rowIndex + 3)][40],
              FIS: rows[(rowIndex + 3)][41],
              KIM: rows[(rowIndex + 3)][42],
              EKO: rows[(rowIndex + 3)][43],
            },
            SEMESTER_4: {
              PABP: rows[(rowIndex + 3)][44],
              PPKN: rows[(rowIndex + 3)][45],
              B_IND: rows[(rowIndex + 3)][46],
              MTK_W: rows[(rowIndex + 3)][47],
              S_IND: rows[(rowIndex + 3)][48],
              BING_W: rows[(rowIndex + 3)][49],
              S_BUD: rows[(rowIndex + 3)][50],
              PJOK: rows[(rowIndex + 3)][51],
              PKWU: rows[(rowIndex + 3)][52],
              MTK_T: rows[(rowIndex + 3)][53],
              BIO: rows[(rowIndex + 3)][54],
              FIS: rows[(rowIndex + 3)][55],
              KIM: rows[(rowIndex + 3)][56],
              EKO: rows[(rowIndex + 3)][57],
            },
            SEMESTER_5: {
              PABP: rows[(rowIndex + 3)][58],
              PPKN: rows[(rowIndex + 3)][59],
              B_IND: rows[(rowIndex + 3)][60],
              MTK_W: rows[(rowIndex + 3)][61],
              S_IND: rows[(rowIndex + 3)][62],
              BING_W: rows[(rowIndex + 3)][63],
              S_BUD: rows[(rowIndex + 3)][64],
              PJOK: rows[(rowIndex + 3)][65],
              PKWU: rows[(rowIndex + 3)][66],
              MTK_T: rows[(rowIndex + 3)][67],
              BIO: rows[(rowIndex + 3)][68],
              FIS: rows[(rowIndex + 3)][69],
              KIM: rows[(rowIndex + 3)][70],
              EKO: rows[(rowIndex + 3)][71],
            },
            TAHUN: rows[(rowIndex + 3)][72],
            UNIV: rows[(rowIndex + 3)][73],
            JRSN: rows[(rowIndex + 3)][74],
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
            }
            
            // Menghitung rata-rata nilai mapel
            let totalNilai = 0;
            for (let i = 2; i <= 15; i++) {
              totalNilai += summaryNilai[Object.keys(summaryNilai)[i]]; // Mengakses nilai mapel berdasarkan nama atribut
              summaryNilai[Object.keys(summaryNilai)[i]] /= 5; // Menghitung rata-rata nilai mapel
            }
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

