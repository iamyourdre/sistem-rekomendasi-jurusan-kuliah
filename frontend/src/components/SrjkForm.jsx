import React, { useState, useEffect } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import axios from 'axios';
import SrjkRumpun from "./SrjkRumpun";

const SrjkForm = () => {

  const mapels = ["PABP", "PPKN", "B.Indonesia", "MTK Wajib", "Sejarah Indonesia", "B.Inggris Wajib", "Seni Budaya", "PJOK", "PKWU", "MTK Peminatan", "Biologi", "Fisika", "Kimia", "Ekonomi", "B.Inggris Terapan"];
  const semesters = ["1", "2", "3", "4", "5"];

  const [formData, setFormData] = useState(getInitialFormData());
  const [averageScores, setAverageScores] = useState({});
  const [probData, setProbData] = useState([]);

  // Mengambil nilai-nilai dari cookie saat komponen dimuat dan menginisialisasi state
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

  // Fungsi untuk mengubah kunci sesuai dengan format yang diharapkan
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
    semesters.forEach((semester, semesterIndex) => {
      mapels.forEach((mapel, mapelIndex) => {
        if (scores[index] !== undefined) {
          if(semester > 2 && mapelIndex === 14){
            const key = formatKey(semester, mapel);
            updatedFormData[key] = 0;
            handleInputChange(semester, mapel, updatedFormData[key])
            index--;
          } else {
            const key = formatKey(semester, mapel);
            updatedFormData[key] = scores[index];
            handleInputChange(semester, mapel, updatedFormData[key])
          }
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

  // Fungsi untuk menghitung rata-rata nilai setiap mata pelajaran
  function calculateAverageScores() {
    const averages = {};
    mapels.forEach(mapel => {
      let totalScore = 0;
      let count = 0;
      semesters.forEach(semester => {
        const score = parseFloat(formData[formatKey(semester, mapel)]);
        if (score>0) {
          totalScore += score;
          count++;
        }
      });
      const average = count > 0 ? totalScore / count : 0;
      averages[mapel] = average.toFixed(2);
    });
    setAverageScores(averages);
    return averages;
  }

  // Fungsi untuk menangani submit
  function handleSubmit() {

    const avgSc = calculateAverageScores();

    const averageScoresArray = Object.values(avgSc);

    // Membuat objek requestBody sesuai dengan bentuk yang diharapkan oleh API
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

    // Setelah setState probData dengan response dari server
    axios.post('http://localhost:5000/api/nb/naiveBayesClassifier', requestBody)
      .then(response => {
        // Mendapatkan probData dari response
        const probDataFromServer = response.data.probData;
        
        // Mengurutkan probData berdasarkan p_yes secara descending
        const sortedProbData = probDataFromServer.sort((a, b) => b.p_yes - a.p_yes);
        
        // Menetapkan probData yang sudah diurutkan ke state
        setProbData(sortedProbData);

        // Mencari elemen dengan id "rekomendasi"
        const rekomendasiElement = document.getElementById('rekomendasi');
        // Memastikan elemen ditemukan sebelum mencoba untuk mengarahkan scroll
        if (rekomendasiElement) {
          // Mengarahkan scroll ke elemen "rekomendasi" secara smooth
          rekomendasiElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      })
      .catch(error => {
        console.error('Error submitting average scores:', error);
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

  function biggerOrSame(grade1, grade2) {
    const gradeOrder = ["A", "A-", "B+", "B", "B-", "CDE"];
    const index1 = gradeOrder.indexOf(grade1);
    const index2 = gradeOrder.indexOf(grade2);
    return index1 <= index2;
  }
  return (
    <div>
      <div className="px-4 md:px-8">
        <div className="bg-p-light rounded-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div role="alert" className="alert text-left bg-green-500 mb-3 inline-block rounded-md text-white text-sm">
                <span className="label text-xl font-bold mb-2">Cara Menggunakan:</span>
                <ol class="list-decimal pl-4 mt-2">
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
              <FaCircleInfo className='inline text-md relative bottom-0.5 mr-2'/>
              Berdasarkan hasil klasifikasi, <b>anda direkomendasikan untuk masuk ke jurusan <u>{probData[0].jurusan.jurusan}</u></b>. Untuk dijadikan pertimbangan, silahkan cek detail dan rekomendasi lainnya pada tabel dibawah ini. 
            </div>
              <div className="overflow-x-auto w-full">      
                <table className="w-full table-xs border-collapse border border-gray-400">
                  <tbody>
                    <tr>
                      <th className="border border-gray-400 px-4 py-2" rowSpan='2'>Rekomendasi</th>
                      <th className="border border-gray-400 px-4 py-2" colSpan='15'>Rata-Rata Bobot</th>
                      <th className="border border-gray-400 bg-p-dark text-white px-4 py-2" rowSpan='3'>Rasio Kualifikasi</th>
                      <th className="border border-gray-400 bg-p-dark text-white px-4 py-2" rowSpan='3'>Probabilitas Klasifikasi</th>
                    </tr>
                    <tr>
                      {mapels.map((mapel) => (
                        <td className="border border-gray-400 px-4 py-2 font-bold [writing-mode:vertical-lr]">{mapel}</td>
                      ))}
                    </tr>
                    <tr className="bg-p-dark text-white">
                      <td className="border border-gray-400 px-4 py-2"><b>NILAI ANDA</b></td>
                      {mapels.map((mapel) => (
                        <td className="border border-gray-400 px-4 py-2">{convertToGrade(averageScores[mapel])}</td>
                      ))}
                    </tr>
                    {probData.map((pData) => (
                      pData.reference.map((rData, index) => {
                        let count = 0;
                        return(
                          <tr key={index}>
                            <td className="border border-gray-400 px-4 py-2">
                              <ul>
                                <li className="font-bold">{rData.jurusan_key.jurusan}</li>
                                <li>{rData.univ_key.universitas}</li>
                                <li>{rData.nama} </li>
                              </ul>
                            </td>
                            {Object.keys(rData.summary_key[0]).map((key, idx) => {
                              const status = biggerOrSame(convertToGrade(averageScores[mapels[idx-2]]), convertToGrade(rData.summary_key[0][key]));
                              if(status){count++};
                              return (
                              key.startsWith('mean_') &&
                              <td className={`border border-gray-400 px-4 py-2 font-semibold ${status?'bg-green-300':'bg-red-300'}`} key={idx}>
                                {convertToGrade(rData.summary_key[0][key])}
                              </td>
                            )})}
                            <td className="border border-gray-400 px-4 py-2 font-bold">{(((count-2) / 15) * 100).toFixed(2)}%</td>
                            <td className="border border-gray-400 px-4 py-2 font-bold">{pData.p_yes}</td>
                          </tr>
                        )
                      })
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <SrjkRumpun rmpn={probData[0].jurusan.rumpun_key.rumpun} /> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default SrjkForm