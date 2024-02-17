import { SiswaIpaModel, NilaiIpaModel, SummaryIpaModel } from "../models/IpaModel.js";
import readXlsxFile from "read-excel-file/node";
import path from "path";
import { fileURLToPath } from "url";
import { findOrCreateCollege } from "./CollegeController.js";
import {JurusanModel, UnivModel} from "../models/CollegeModel.js";

export const upload = async (req, res) => {
  try {

    req.body.reset === "y" ? await deleteAllIpa() : undefined;
    // req.reset ? y (reset) : false (no reset)

    if (req.file === undefined) {
      return res.status(400).send("Silakan unggah file .xlsx!");
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
            RUMPUN: rows[(rowIndex + 3)][77],
          };
          dataset.push(datas);
        }
      });


      try {


        // Membuat data siswa dan data nilai untuk setiap siswa
        for (const data of dataset) {
          
          const college = await findOrCreateCollege(data.UNIV, data.JRSN, data.RUMPUN);
          const isDupli = await isDuplication(data, college.univ_id, college.jurusan_id);
          
          if (!isDupli) {
            const createdSiswa = await SiswaIpaModel.create({
              nama: data.NAMA || "-",
              akt_thn: data.TAHUN || 0,
              univ_id: college.univ_id,
              jurusan_id: college.jurusan_id
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
              await NilaiIpaModel.create(nilaiData);

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

            
            await SummaryIpaModel.create(summaryNilai);

          }
        }
      
        res.status(200).send({
          message: "Dataset " + req.file.originalname +" berhasil diimpor!",
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
      message: "Dataset " + req.file.originalname +" gagal diimpor!",
    });
  }
};

export const getAllIpa = async (req, res) => {
  try {
    const siswaData = await SiswaIpaModel.findAll({
      include: [
        {
          model: JurusanModel,
          as: 'jurusan_ipa_key',
        },
        {
          model: UnivModel,
          as: 'univ_ipa_s',
        },
        {
          model: SummaryIpaModel,
          as: 'summary_ipa_s',
        },
        {
          model: NilaiIpaModel,
          as: 'nilai_ipa_s',
        },
      ],
    });
    res.status(200).json({
      data: siswaData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const isDuplication = async (data, u_id, j_id) => {
  try {
    // Cari data siswa berdasarkan nama, dan sertakan relasinya dengan nilai ipa
    if(await SiswaIpaModel.findOne({
      where: { 
        nama: data.NAMA,
        univ_id: u_id || 1,
        jurusan_id: j_id || 1,
      },
      include: [{ 
        model: NilaiIpaModel,
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
        as: 'nilai_ipa_s' 
      }],
      raw: true,
    })) return true

    return false;

  } catch (error) {
    console.error('Error:', error);
    throw new Error("Gagal memeriksa data duplikat: " + error.message);
  }
};

export const deleteAllIpa = async () => {
  try {

    // Hapus semua data dalam tabel NilaiIpaModel
    await NilaiIpaModel.destroy({ where: {} });

    // Hapus semua data dalam tabel SiswaIpaModel
    await SiswaIpaModel.destroy({ where: {} });
    
    // Hapus semua data dalam tabel SummaryIpaModel
    await SummaryIpaModel.destroy({ where: {} });

    return {
      success: true,
      message: "Berhasil menghapus semua data dalam tabel!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal menghapus semua data dalam tabel!",
      error: error.message,
    };
  }
};
