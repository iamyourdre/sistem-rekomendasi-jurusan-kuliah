import React, { useState, useEffect } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import ProbDataHandler from "../contexts/ProbDataHandler";

const SrjkForm = () => {
  const handler = new ProbDataHandler();
  const { mapels, semesters } = handler;

  const [formData, setFormData] = useState(getInitialFormData());
  const [averageScores, setAverageScores] = useState({});
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

  function handlePaste(event) {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text');
    const scores = pastedData.split('\t').map(score => parseInt(score.trim(), 10));

    let updatedFormData = { ...formData };

    let index = 0;
    semesters.forEach((semester, semesterIndex) => {
      mapels.forEach((mapel, mapelIndex) => {
        if (scores[index] !== undefined) {
          if (semester > 2 && mapelIndex === 14) {
            const key = handler.formatKey(semester, mapel);
            updatedFormData[key] = 0;
            handleInputChange(semester, mapel, updatedFormData[key]);
            index--;
          } else {
            const key = handler.formatKey(semester, mapel);
            updatedFormData[key] = scores[index];
            handleInputChange(semester, mapel, updatedFormData[key]);
          }
        }
        index++;
      });
    });

    setFormData(updatedFormData);
  }

  function handleInputChange(semester, mapel, value) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const cookieKey = handler.formatKey(semester, mapel);
    const cookieValue = `${cookieKey}=${value}; expires=${expires.toUTCString()}; path=/`;

    const newFormData = { ...formData, [cookieKey]: value };
    setFormData(newFormData);
    document.cookie = cookieValue;
  }

  function resetAllValues() {
    const newFormData = {};
    setFormData(newFormData);
    mapels.forEach(mapel => {
      semesters.forEach(semester => {
        document.cookie = `${handler.formatKey(semester, mapel)}=; path=/;`;
      });
    });
  }

  function calculateAverageScores() {
    const averages = {};
    mapels.forEach(mapel => {
      let totalScore = 0;
      let count = 0;
      semesters.forEach(semester => {
        const score = parseFloat(formData[handler.formatKey(semester, mapel)]);
        if (score > 0) {
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

  function handleSubmit() {
    const avgSc = calculateAverageScores();
    handler.submitAverageScores(avgSc, setProbData);
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
                              : formData[handler.formatKey(semester, mapel)] || ''
                          }
                          onChange={(e) => handleInputChange(semester, mapel, e.target.value)}
                          onPaste={handlePaste}
                          id={handler.formatKey(semester, mapel)}
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
                      <td className="border border-gray-400 px-4 py-2 font-bold [writing-mode:vertical-lr]" key={mapel}>{mapel}</td>
                    ))}
                  </tr>
                  <tr className="bg-p-dark text-white">
                    <td className="border border-gray-400 px-4 py-2"><b>NILAI ANDA:</b></td>
                    {mapels.map((mapel) => (
                      <td className="border border-gray-400 px-4 py-2" key={mapel}>{handler.convertToGrade(averageScores[mapel])}</td>
                    ))}
                  </tr>
                  {probData.map((pData) => (
                    pData.reference.map((rData, index) => {
                      let count = 0;
                      return (
                        <tr key={index}>
                          <td className="border border-gray-400 px-4 py-2">
                            <ul>
                              <li className="font-bold">{rData.jurusan_key.jurusan}</li>
                              <li>{rData.univ_key.universitas}</li>
                              <li>{rData.nama}</li>
                            </ul>
                          </td>
                          {Object.keys(rData.summary_key[0]).map((key, idx) => {
                            const status = handler.biggerOrSame(handler.convertToGrade(averageScores[mapels[idx-2]]), handler.convertToGrade(rData.summary_key[0][key]));
                            if (status) { count++; }
                            return (
                              key.startsWith('mean_') &&
                              <td className={`border border-gray-400 px-4 py-2 font-semibold ${status ? 'bg-green-300' : 'bg-red-300'}`} key={idx}>
                                {handler.convertToGrade(rData.summary_key[0][key])}
                              </td>
                            );
                          })}
                          <td className="border border-gray-400 px-4 py-2 font-bold">{(((count-2) / 15) * 100).toFixed(2)}%</td>
                          <td className="border border-gray-400 px-4 py-2 font-bold">{pData.p_yes}</td>
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
  );
};

export default SrjkForm;
