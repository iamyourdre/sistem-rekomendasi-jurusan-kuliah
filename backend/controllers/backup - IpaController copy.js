// import { SiswaIpaModel, NilaiIpaModel } from "../models/IpaModel.js";
// import readXlsxFile from "read-excel-file/node";
// import path from "path";
// import { fileURLToPath } from "url";

// export const upload = async (req, res) => {
//   try {
//     if (req.file === undefined) {
//       return res.status(400).send("Silakan unggah file Excel!");
//     }

//     // Direktori untuk menyimpan file upload
//     const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..\\assets\\uploads\\");

//     // Membaca file Excel
//     readXlsxFile(uploadDir + req.file.filename).then(async (rows) => {

//       // Mengambil baris header untuk menemukan indeks kolom
//       const headerRow = rows.shift();
      
//       const dataIndex = {
//         NAMA: headerRow.indexOf("NAMA"),
//         TAHUN: headerRow.indexOf("TAHUN"),
//         PABP: headerRow.indexOf("PABP"),
//         PPKN: headerRow.indexOf("PPKN"),
//         B_IND: headerRow.indexOf("B_IND"),
//         MTK_W: headerRow.indexOf("MTK_W"),
//         S_IND: headerRow.indexOf("S_IND"),
//         BING_W: headerRow.indexOf("BING_W"),
//         S_BUD: headerRow.indexOf("S_BUD"),
//         PJOK: headerRow.indexOf("PJOK"),
//         PKWU: headerRow.indexOf("PKWU"),
//         MTK_T: headerRow.indexOf("MTK_T"),
//         BIO: headerRow.indexOf("BIO"),
//         FIS: headerRow.indexOf("FIS"),
//         KIM: headerRow.indexOf("KIM"),
//         EKO: headerRow.indexOf("EKO"),
//         BING_T: headerRow.indexOf("BING_T")
//       }
      
      
//       // Cek apakah rows tidak kosong
//       if (rows.length > 0) {
//         // Melakukan looping untuk setiap baris
//         for (let i = 0; i < rows.length; i++) {
//           // Melakukan looping untuk setiap kolom dalam baris
//           for (let j = 0; j < headerRow.length; j++) {
//             // Membaca nilai dari baris i kolom j jika nilainya tidak undefined
//             if (rows[i][j] !== undefined && rows[i][j] !== null) {
//               console.log(`Nilai dari baris ke-${i + 1} kolom ke-${j + 1}:`, rows[i][j]);
//             }
//           }
//         }
//       } else {
//         console.log("Rows kosong.");
//       }


      
//       let dataset = [];

//       // Mengisi dataset dengan data dari file Excel
//       rows.forEach((row) => {
//         let datas = {
//           NAMA: row[dataIndex.NAMA],
//           TAHUN: row[dataIndex.TAHUN],
//           PABP: row[dataIndex.PABP],
//           PPKN: row[dataIndex.PPKN],
//           B_IND: row[dataIndex.B_IND],
//           MTK_W: row[dataIndex.MTK_W],
//           S_IND: row[dataIndex.S_IND],
//           BING_W: row[dataIndex.BING_W],
//           S_BUD: row[dataIndex.S_BUD],
//           PJOK: row[dataIndex.PJOK],
//           PKWU: row[dataIndex.PKWU],
//           MTK_T: row[dataIndex.MTK_T],
//           BIO: row[dataIndex.BIO],
//           FIS: row[dataIndex.FIS],
//           KIM: row[dataIndex.KIM],
//           EKO: row[dataIndex.EKO],
//           BING_T: row[dataIndex.BING_T],
//           SEMS: 1
//         };

//         dataset.push(datas);
//       });

//       try {
//         // Membuat data siswa dan data nilai untuk setiap siswa
//         const nilaiPromises = dataset.map(async (data) => {
//           const createdSiswa = await SiswaIpaModel.create({
//             nama: data.NAMA,
//             akt_thn: data.TAHUN,
//             univ: "-",
//             fklts: "-",
//             jrsn: "-",
//           });
      
//           await NilaiIpaModel.create({
//             siswa_id: createdSiswa.id,
//             PABP: data.PABP,
//             PPKN: data.PPKN,
//             B_IND: data.B_IND,
//             MTK_W: data.MTK_W,
//             S_IND: data.S_IND,
//             BING_W: data.BING_W,
//             S_BUD: data.S_BUD,
//             PJOK: data.PJOK,
//             PKWU: data.PKWU,
//             MTK_T: data.MTK_T,
//             BIO: data.BIO,
//             FIS: data.FIS,
//             KIM: data.KIM,
//             EKO: data.EKO,
//             BING_T: data.BING_T,
//             SEMS: data.SEMS
//           });
//         });
      
//         await Promise.all(nilaiPromises);
      
//         res.status(200).send({
//           message: "Berhasil mengunggah file: " + req.file.originalname,
//         });
//       } catch (error) {
//         res.status(500).send({
//           message: "Gagal mengimpor data ke database!",
//           error: error.message,
//         });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Tidak dapat mengunggah file: " + req.file.originalname,
//     });
//   }
// };
// // IpaController.js

// export const getAllIpa = async (req, res) => {
//   try {
//     const siswaData = await SiswaIpaModel.findAll({
//       include: [
//         {
//           model: NilaiIpaModel,
//           as: 'nilai_ipa_s', // Gunakan alias yang sesuai dengan yang Anda definisikan di model
//         },
//       ],
//     });

//     res.status(200).json({
//       message: "Berhasil mendapatkan data siswa beserta nilai IPA",
//       data: siswaData,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Gagal mendapatkan data siswa beserta nilai IPA",
//       error: error.message,
//     });
//   }
// };
