import React, { useState, useEffect } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { TbAlertTriangle } from "react-icons/tb";
import axios from 'axios';

const Srjk = ({ title, subtitle }) => {

  const mapels = ["PABP", "PPKN", "B.Indonesia", "MTK Wajib", "Sejarah Indonesia", "B.Inggris Wajib", "Seni Budaya", "PJOK", "PKWU", "MTK Terapan", "Biologi", "Fisika", "Kimia", "Ekonomi", "B.Inggris Terapan"];
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
    console.log(averageScoresArray);

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
      })
      .catch(error => {
        console.error('Error submitting average scores:', error);
      });

  }

  return (
    <div className="w-full">
      <div className="px-4 md:px-8">
        <div className="bg-p-light rounded-md p-6">
          <div role="alert" className="alert text-left bg-red-500 mb-3 inline-block rounded-md text-white text-sm">
            <FaCircleInfo className='inline text-md relative bottom-0.5 mr-2'/>
            <b>Note!</b>&nbsp;
            Untuk menginput dataset siswa, silahkan unduh dan gunakan template xlsx dibawah ini.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='border-1 border-t-light rounded-md bg-s-light p-4'>
              Cara Menggunakan:
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
      {Object.keys(averageScores).length > 0 && (
        <div className="px-4 md:px-8 mt-4">
          <div className="bg-p-light rounded-md p-6">
            <h2 className="text-xl font-bold mb-4">Nilai Rata-rata Setiap Mata Pelajaran:</h2>
            <ul>
              {mapels.map((mapel, index) => (
                <li key={index}>
                  <strong>{mapel}:</strong> {averageScores[mapel]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {probData.length > 0 && (
        <div className="px-4 md:px-8 mt-4">
          <div className="bg-p-light rounded-md p-6">
            <h2 className="text-xl font-bold mb-4">Tabel Probabilitas</h2>
            <table className="border-collapse border border-gray-400 w-full">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">#</th>
                  <th className="border border-gray-400 px-4 py-2">Jurusan ID</th>
                  <th className="border border-gray-400 px-4 py-2">Probabilitas Yes</th>
                  <th className="border border-gray-400 px-4 py-2">Probabilitas No</th>
                  <th className="border border-gray-400 px-4 py-2">Persentase Yes</th>
                  <th className="border border-gray-400 px-4 py-2">Persentase No</th>
                </tr>
              </thead>
              <tbody>
                {probData.map((data, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-400 px-4 py-2">{data.jurusan_id}</td>
                    <td className="border border-gray-400 px-4 py-2">{data.p_yes}</td>
                    <td className="border border-gray-400 px-4 py-2">{data.p_no}</td>
                    <td className="border border-gray-400 px-4 py-2">{((data.p_yes / (data.p_yes + data.p_no)) * 100).toFixed(2)}%</td>
                    <td className="border border-gray-400 px-4 py-2">{((data.p_no / (data.p_yes + data.p_no)) * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


    </div>
  );
};

export default Srjk;
