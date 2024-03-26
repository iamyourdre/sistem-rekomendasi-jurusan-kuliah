import React from 'react';
import { rumpunJurusan } from "../data/constant";

const SrjkRumpun = ({ rmpn }) => {
  let filteredIndex = null;

  // Lakukan pencocokan if untuk nilai rmpn
  if (rmpn === "RUMPUN ILMU AGAMA") {
    // Jika rmpn adalah "RUMPUN ILMU AGAMA", tentukan index array yang sesuai
    filteredIndex = 0;
  } else if (rmpn === "RUMPUN ILMU HUMANIORA") {
    filteredIndex = 1;
  } else if (rmpn === "RUMPUN ILMU SOSIAL") {
    filteredIndex = 2;
  } else if (rmpn === "RUMPUN ILMU ALAM") {
    filteredIndex = 3;
  } else if (rmpn === "RUMPUN ILMU FORMAL") {
    filteredIndex = 4;
  } else if (rmpn === "RUMPUN ILMU TERAPAN") {
    filteredIndex = 5;
  }

  // Melanjutkan dengan menggunakan nilai filteredIndex untuk mengakses data yang sesuai
  return (
    <div className="overflow-x-auto w-full">      
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Klasifikasi Rumpun</th>
            <th className="border border-gray-400 px-4 py-2">Deskripsi</th>
            <th className="border border-gray-400 px-4 py-2">Program Studi</th>
          </tr>
        </thead>
        <tbody>
          {/* Gunakan filteredIndex untuk mengakses data yang difilter */}
          {rumpunJurusan[filteredIndex]?.subfields.map((subfield, subIndex) => (
            <tr key={`${filteredIndex}-${subIndex}`}>
              <td className="border border-gray-400 px-4 py-2" rowSpan={subfield.field.length}>{rumpunJurusan[filteredIndex].name}</td>
              <td className="border border-gray-400 px-4 py-2" rowSpan={subfield.field.length}>{rumpunJurusan[filteredIndex].desc}</td>
              <td className="border border-gray-400 px-4 py-2">{subfield.name}</td>
              <td className="border border-gray-400 px-4 py-2">
                <ul>
                  {subfield.field.map((program, programIndex) => (
                    <li key={`${filteredIndex}-${subIndex}-${programIndex}`}>{program}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SrjkRumpun;
