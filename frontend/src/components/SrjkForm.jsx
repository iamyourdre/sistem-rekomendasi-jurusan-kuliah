import React, { useEffect, useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import axios from 'axios';
var distance = require('euclidean-distance');

const SrjkForm = () => {
  const mapels = ["PABP", "PPKN", "B.Indonesia", "MTK Wajib", "Sejarah Indonesia", "B.Inggris", "Seni Budaya", "PJOK", "PKWU", "MTK Peminatan", "Biologi", "Fisika", "Kimia", "Ekonomi"];
  const semesters = ["1", "2", "3", "4", "5"];

  const [formData, setFormData] = useState(getInitialFormData());
  const [myAverageScores, setMyAverageScores] = useState({});
  const [myAverageGrades, setMyAverageGrades] = useState({});
  const [probData, setProbData] = useState([]);
  const [eucDistResult, setEucDistResult] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [scrollDone, setScrollDone] = useState(false);


  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 5);
  };

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

  function isLowerSameBigger(grade1, grade2) {
    const gradeOrder = ["A", "A-", "B+", "B", "B-", "CDE"];
    const index1 = gradeOrder.indexOf(grade1);
    const index2 = gradeOrder.indexOf(grade2);
  
    if (index1 > index2) {
      return -1;
    } else if (index1 < index2) {
      return 1;
    } else {
      return 0;
    }
  }
  
  function formatKey(semester, mapel) {
    return `s${semester}_${mapel.replace(/\s+/g, '_')}`;
  }
  
  // Fungsi untuk menangani paste dari clipboard
  function handlePaste(event) {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text');
    const scores = pastedData.split('\t').map(score => parseInt(score.trim(), 10));
  
    // Menetapkan nilai-nilai yang dipaste ke input sesuai dengan urutannya
    let updatedFormData = { ...formData }; // Copy the current state
  
    let index = 0;
    semesters.forEach((semester) => {
      mapels.forEach((mapel) => {
        if (scores[index] !== undefined) {
          const key = formatKey(semester, mapel);
          updatedFormData[key] = scores[index];
          handleInputChange(semester, mapel, updatedFormData[key]);
        }
        index++;
      });
    });
  
    // Set the updated state
    setFormData(updatedFormData);
  }
  
  
  // Fungsi untuk menyimpan nilai input ke state dan cookie
  function handleInputChange(semester, mapel, value) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
  
    const cookieKey = formatKey(semester, mapel);
    const cookieValue = `${cookieKey}=${value}; expires=${expires.toUTCString()}; path=/`;
  
    const newFormData = { ...formData, [cookieKey]: value };
    setFormData(newFormData);
    document.cookie = cookieValue;
  }
  
  // Fungsi untuk mereset semua nilai input dan hapus cookie
  function resetAllValues() {
    const newFormData = {};
    setFormData(newFormData);
    mapels.forEach(mapel => {
      semesters.forEach(semester => {
        document.cookie = `${formatKey(semester, mapel)}=; path=/;`;
      });
    });
  }
  
  function convertToGrade(score) {
    const numericScore = parseFloat(score)
    if (numericScore >= 90) {
      return "A";
    } else if (numericScore >= 85) {
      return "A-";
    } else if (numericScore >= 80) {
      return "B+";
    } else if (numericScore >= 75) {
      return "B";
    } else if (numericScore >= 70) {
      return "B-";
    } else {
      return "CDE";
    }
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

  async function handleSubmit() {
    const avg = Object.values(calcAvgScores());
  
    const myAvg = {
      x1: avg[0],
      x2: avg[1],
      x3: avg[2],
      x4: avg[3],
      x5: avg[4],
      x6: avg[5],
      x7: avg[6],
      x8: avg[7],
      x9: avg[8],
      x10: avg[9],
      x11: avg[10],
      x12: avg[11],
      x13: avg[12],
      x14: avg[13],
    };
    
    const probData = await naiveBayes(myAvg);
    const eucDistData = await eucDist(avg, probData);
    setEucDistResult(eucDistData);
    setScrollDone(false);
  }  
  
  async function naiveBayes(req) {
    return axios.post('http://localhost:5000/api/dataset/naiveBayesClassifier', req).then(response => {
      const probDataFromServer = response.data.probData;
      const sortedProbData = probDataFromServer.sort((a, b) => b.p_yes - a.p_yes);
      setProbData(sortedProbData);
      return sortedProbData;
    })
    .catch(error => {
      console.error('Error submitting average scores:', error);
      throw error; // Re-throw the error to ensure handleSubmit can handle it if needed
    });
  }
  
  
  async function eucDist(my_score, probData) {
    let shortestSimilarity = [];
    let shortestScore = 999;
    probData.forEach(data => {
      data.ref[0].forEach(ref => {
        ref.summary_key.forEach(score => {
          const dist = distance([
            my_score[0], 
            my_score[1], 
            my_score[2], 
            my_score[3], 
            my_score[4], 
            my_score[5], 
            my_score[6], 
            my_score[7], 
            my_score[8], 
            my_score[9], 
            my_score[10], 
            my_score[11], 
            my_score[12], 
            my_score[13],
          ], [
            Object.values(score)[2], 
            Object.values(score)[3], 
            Object.values(score)[4], 
            Object.values(score)[5], 
            Object.values(score)[6], 
            Object.values(score)[7], 
            Object.values(score)[8], 
            Object.values(score)[9], 
            Object.values(score)[10], 
            Object.values(score)[11], 
            Object.values(score)[12], 
            Object.values(score)[13], 
            Object.values(score)[14], 
            Object.values(score)[15],
          ])

          // jika jarak euc dist sama dengan rekor shortestScore, maka cek tahun angkatan
          if(dist == shortestScore){ 
            if(shortestSimilarity[0].akt_thn<ref.akt_thn){
              shortestSimilarity = [];
              shortestSimilarity.push(ref); // gunakan angkatan paling baru karena lebih relevan
              shortestScore = dist;
            }
          } else if(dist < shortestScore){
            shortestSimilarity = [];
            shortestSimilarity.push(ref); // gunakan angkatan paling baru karena lebih relevan
            shortestScore = dist;
          }
        });
      });
    });
    setEucDistResult(shortestSimilarity);
    return shortestSimilarity;
  }

  useEffect(() => {
    if (scrollDone) {
      const rekomendasiElement = document.getElementById('rekomendasi');
      if (rekomendasiElement) {
        rekomendasiElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [scrollDone]);
  
  useEffect(() => {
    if (eucDistResult) {
      setScrollDone(true);
    }
  }, [eucDistResult]);
  

  return (
    <div>

      {/* Form Input Nilai */}
      <div className="px-4 md:px-8">
        <div className="bg-p-light rounded-md p-6">
          <div className="">

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

            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>Semester</th>
                    {mapels.map((mapel) => (
                      <th className="text-wrap">{mapel}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {semesters.map((semester) => (
                    <tr>
                      <th>{semester}</th>
                    {mapels.map((mapel) => (
                      <th>
                        <input
                          type="number"
                          placeholder="Masukkan nilai anda"
                          className="input input-bordered w-16 focus-visible:outline-none text-sm"
                          value={formData[formatKey(semester, mapel)] || ''}
                          onChange={(e) => handleInputChange(semester, mapel, e.target.value)}
                          onPaste={handlePaste}
                          id={formatKey(semester, mapel)}
                        />
                      </th>
                    ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
              Berdasarkan hasil klasifikasi, <b>anda direkomendasikan untuk masuk ke jurusan <u>{eucDistResult && (eucDistResult[0].jurusan_key.jurusan)}</u></b>. Untuk dijadikan pertimbangan, silahkan cek detail dan rekomendasi lainnya pada tabel dibawah ini.
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full table-xs border-collapse border border-gray-400">
                <tbody>
                  <tr>
                    <th className="border border-gray-400 px-4 py-2" rowSpan='3'>Rekomendasi Jurusan</th>
                    <th className="border border-gray-400 px-4 py-2" rowSpan='2'>Nilai</th>
                    <th className="border border-gray-400 px-4 py-2" colSpan='14'>Rata-Rata Bobot</th>
                    <th className="border border-gray-400 bg-p-dark text-white px-4 py-2" rowSpan='3'>Rasio Kualifikasi</th>
                    <th className="border border-gray-400 bg-p-dark text-white px-4 py-2" rowSpan='3'>Probabilitas Klasifikasi</th>
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

                  {probData.slice(0, visibleCount).map((pData, index) => (
                    pData.ref[0].map((rData, idx) => {
                      let count = 0;
                      return (
                        <tr key={`${index}-${idx}`}>
                          {idx === 0 && (
                            <td className="border border-gray-400 px-4 py-2" rowSpan={pData.ref[0].length}>
                              <span className={`${(eucDistResult[0].jurusan_key.jurusan == pData.jurusan.jurusan) ? 'tooltip tooltip-open tooltip-primary pt-1' : ''}`} data-tip="⭐">
                                {pData.jurusan.jurusan}
                              </span>
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
                          <td className="border border-gray-400 px-4 py-2 font-bold">{((count / 14) * 100).toFixed(2)}%</td>
                          {idx === 0 && (
                            <>
                              <td className="border border-gray-400 px-4 py-2 font-bold" rowSpan={pData.ref[0].length}>
                                {pData.p_yes}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })
                  ))}
                </tbody>
              </table>
              {visibleCount < probData.length && (
                <button onClick={handleShowMore} className="btn bg-p-light border border-t-light my-4" >
                  Tampilkan lainnya
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SrjkForm;
