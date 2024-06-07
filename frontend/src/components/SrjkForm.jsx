import React, { useState, useEffect } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import axios from 'axios';
var distance = require('euclidean-distance');

import {
  isLowerSameBigger,
  handlePaste,
  handleInputChange,
  resetAllValues,
  convertToGrade
} from "../utils/SrjkFormHelpers";

const SrjkForm = () => {
  const mapels = ["PABP", "PPKN", "B.Indonesia", "MTK Wajib", "Sejarah Indonesia", "B.Inggris Wajib", "Seni Budaya", "PJOK", "PKWU", "MTK Peminatan", "Biologi", "Fisika", "Kimia", "Ekonomi", "B.Inggris Terapan"];
  const semesters = ["1", "2", "3", "4", "5"];

  const [formData, setFormData] = useState(getInitialFormData());
  const [myAverageScores, setMyAverageScores] = useState({});
  const [myAverageGrades, setMyAverageGrades] = useState({});
  const [probData, setProbData] = useState([]);

  function getInitialFormData() {
    const cookieData = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      if (key.trim().startsWith('s')) {
        acc[key.trim()] = value;
      }
      return acc;
    }, {});
    return cookieData;
  }

  function formatKey(semester, mapel) {
    return `s${semester}_${mapel.replace(/\s+/g, '_')}`;
  }

  function calcAvgScores() {
    // Menetapkan nilai rata-rata
    const avgScores = {};
    mapels.forEach(mapel => {
      let totalScore = 0;
      let count = 0;
      semesters.forEach(semester => {
        const score = parseFloat(formData[formatKey(semester, mapel)]);
        if (score > 0) {
          totalScore += score;
          count++;
        }
      });
      const avg = count > 0 ? totalScore / count : 0;
      avgScores[mapel] = avg.toFixed(2);
    });

    // Menetapkan nilai rata-rata dalam satuan huruf
    let avgGrades = [];
    Object.values(avgScores).forEach(avg => {
      avgGrades.push(convertToGrade(avg));
    });

    setMyAverageScores(avgScores);
    setMyAverageGrades(avgGrades);
    return avgScores;
  }

  function calcEucDist(my_s, s) {
    console.log(distance([
      my_s[0], 
      my_s[1], 
      my_s[2], 
      my_s[3], 
      my_s[4], 
      my_s[5], 
      my_s[6], 
      my_s[7], 
      my_s[8], 
      my_s[9], 
      my_s[10], 
      my_s[11], 
      my_s[12], 
      my_s[13], 
      my_s[14], 
    ], [
      s[0], 
      s[1], 
      s[2], 
      s[3], 
      s[4], 
      s[5], 
      s[6], 
      s[7], 
      s[8], 
      s[9], 
      s[10], 
      s[11], 
      s[12], 
      s[13], 
      s[14], 
    ]));
  }

  function handleSubmit() {
    const averageScoresArray = Object.values(calcAvgScores());

    const requestBody = {
      x1: averageScoresArray[0],
      x2: averageScoresArray[1],
      x3: averageScoresArray[2],
      x4: averageScoresArray[3],
      x5: averageScoresArray[4],
      x6: averageScoresArray[5],
      x7: averageScoresArray[6],
      x8: averageScoresArray[7],
      x9: averageScoresArray[8],
      x10: averageScoresArray[9],
      x11: averageScoresArray[10],
      x12: averageScoresArray[11],
      x13: averageScoresArray[12],
      x14: averageScoresArray[13],
      x15: averageScoresArray[14]
    };

    axios.post('http://localhost:5000/api/nb/naiveBayesClassifier', requestBody)
      .then(response => {
        const probDataFromServer = response.data.probData;
        const sortedProbData = probDataFromServer.sort((a, b) => b.p_yes - a.p_yes);
        setProbData(sortedProbData);
        console.log(sortedProbData)
        const rekomendasiElement = document.getElementById('rekomendasi');
        if (rekomendasiElement) {
          rekomendasiElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      })
      .catch(error => {
        console.error('Error submitting average scores:', error);
      });
  }

  return (
    <div>
      <div className="px-4 md:px-8">
        <div className="bg-p-light rounded-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div role="alert" className="alert text-left bg-green-500 mb-3 inline-block rounded-md text-white text-sm">
                <span className="label text-xl font-bold mb-2">Cara Menggunakan:</span>
                <ol className="list-decimal pl-4 mt-2">
                  <li> Isi nilai-nilai tiap semester berdasarkan rapor Anda pada kolom input yang disediakan.</li>
                  <li> Koreksi ulang nilai-nilai yang telah anda masukkan demi mencegah kesalahan rekomendasi jurusan.</li>
                  <li> Tekan tombol "Submit" setelah semua nilai dimasukkan.</li>
                  <li> Silahkan tunggu proses klasifikasi hingga selesai.</li>
                  <li> Setelah proses klasifikasi selesai, hasil rekomendasi akan otomatis muncul dibagian paling bawah pada halaman ini.</li>
                </ol>
              </div>
            </div>
            {semesters.map((semester) => (
              <div key={`semester-${semester}`} className='border-1 border-t-light rounded-md bg-s-light p-4'>
                <span className="label text-xl font-bold mb-2">NILAI SEMESTER {semester}</span>
                <div className="grid grid-cols-2 gap-3">
                  {mapels.map((mapel) => (
                    <label key={`semester-${semester}-mapel-${mapel}`} className={`form-control w-full ${semester > 2 && mapel === "B.Inggris Terapan" ? 'hidden' : ''}`}>
                      <div className="label">
                        <span className="label-text">{mapel}</span>
                      </div>
                      <div className="bg-p-light border-1 border-t-light rounded-md px-3 w-full">
                        <input
                          type="number"
                          placeholder="Masukkan nilai anda"
                          className="input w-full bg-transparent max-w-xs focus-visible:outline-none border-0 p-0"
                          value={
                            semester > 2 && mapel === "B.Inggris Terapan"
                              ? '0'
                              : formData[formatKey(semester, mapel)] || ''
                          }
                          onChange={(e) => handleInputChange(semester, mapel, e.target.value)}
                          onPaste={handlePaste}
                          id={formatKey(semester, mapel)}
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row pt-4">
            <div className="basis-1/5">
              <button onClick={resetAllValues} className="btn bg-red-500 text-white w-full">Reset Semua Nilai</button>
            </div>
            <div className="basis-4/5 pl-4">
              <button onClick={handleSubmit} className="btn bg-green-500 text-white w-full">Submit</button>
            </div>
          </div>
        </div>
      </div>
      {probData.length > 0 && (
        <div className="px-4 md:px-8 mt-4">
          <div className="bg-p-light rounded-md p-6 w-full" id="rekomendasi">
            <h2 className="text-xl font-bold mb-3">Rekomendasi Jurusan Untuk Anda</h2>
            <div role="alert" className="alert text-left bg-green-500 mb-3 inline-block rounded-md text-white text-sm">
              <FaCircleInfo className='inline text-md relative bottom-0.5 mr-2' />
              Berdasarkan hasil klasifikasi, <b>anda direkomendasikan untuk masuk ke jurusan <u>{probData[0].jurusan.jurusan}</u></b>. Untuk dijadikan pertimbangan, silahkan cek detail dan rekomendasi lainnya pada tabel dibawah ini.
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full table-xs border-collapse border border-gray-400">
                <tbody>
                  <tr>
                    <th className="border border-gray-400 px-4 py-2" rowSpan='3'>Rekomendasi Jurusan</th>
                    <th className="border border-gray-400 px-4 py-2" rowSpan='2'>Nilai</th>
                    <th className="border border-gray-400 px-4 py-2" colSpan='15'>Rata-Rata Bobot</th>
                    <th className="border border-gray-400 bg-p-dark text-white px-4 py-2" rowSpan='3'>Rasio Kualifikasi</th>
                    <th className="border border-gray-400 bg-p-dark text-white px-4 py-2" rowSpan='3'>Probabilitas Klasifikasi</th>
                    <th className="border border-gray-400 bg-p-dark text-white px-4 py-2" rowSpan='3'>Euclidean Distances</th>
                  </tr>
                  <tr>
                    {mapels.map((mapel, index) => (
                      <td key={index} className="border border-gray-400 px-4 py-2 font-bold [writing-mode:vertical-lr]">{mapel}</td>
                    ))}
                  </tr>
                  <tr className="bg-blue-400 text-white">
                    <td className="border border-gray-400 px-4 py-2"><b>NILAI ANDA</b></td>
                    {myAverageGrades.map((avg, index) => (
                      <td key={index} className="border border-gray-400 px-4 py-2">{avg}</td>
                    ))}
                  </tr>

                  {probData.map((pData, index) => (
                    pData.ref[0].map((rData, idx) => {
                      let count = 0;
                      return (
                        <tr key={`${index}-${idx}`}>
                          {idx === 0 && (
                            <td className="border border-gray-400 px-4 py-2" rowSpan={pData.ref[0].length}>
                              {pData.jurusan.jurusan}
                            </td>
                          )}
                          <td className="border border-gray-400 px-4 py-2">
                            <ul>
                              <li className="font-bold">{rData.nama}</li>
                              <li>{rData.univ_key.universitas}</li>
                            </ul>
                          </td>
                          {Object.keys(rData.summary_key[0]).map((key, id) => {
                            const status = isLowerSameBigger(convertToGrade(myAverageScores[mapels[id - 2]]), convertToGrade(rData.summary_key[0][key]));
                            if (status !== -1) { count++; }
                            return (
                              key.startsWith('mean_') &&
                              <td key={id} className={`border border-gray-400 px-4 py-2 font-semibold ${status > -1 ? (status === 0 ? 'bg-green-300' : 'bg-teal-300') : 'bg-red-300'}`}>
                                {convertToGrade(rData.summary_key[0][key])}
                              </td>
                            );
                          })}
                          <td className="border border-gray-400 px-4 py-2 font-bold">{(((count - 2) / 15) * 100).toFixed(2)}%</td>
                          {idx === 0 && (
                            <td className="border border-gray-400 px-4 py-2 font-bold" rowSpan={pData.ref[0].length}>
                              {pData.p_yes}
                            </td>
                          )}
                          <td className="border border-gray-400 px-4 py-2 font-bold">
                            
                          </td>
                        </tr>
                      );
                    })
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SrjkForm;
