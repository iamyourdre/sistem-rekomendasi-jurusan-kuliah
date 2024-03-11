import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableSiswaEligible = () => {
  const [siswaData, setSiswaData] = useState([]);

  useEffect(()=> {
    getSiswaData();
  },[]);

  const getSiswaData = async () =>{
    
      const response = await axios.get('http://localhost:5000/api/dataset/getEligibleIpa');
      setSiswaData(response.data);
  }

  return (
    <div className="p-4 md:px-8 md:pt-6">
      <div className="bg-p-light rounded-md">
        <div className="overflow-x-auto p-6">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="border-b-1 border-t-dark text-s-dark">
                <th>ID</th>
                <th>Nama Siswa</th>
                <th>Jurusan</th>
                <th>Universitas</th>
                <th>Rumpun</th>
                <th>Tahun Aktif</th>
              </tr>
            </thead>
            <tbody>
              {siswaData.map((siswa) => (
                <tr key={siswa.id}>
                  <td>{siswa.id}</td>
                  <td>{siswa.nama}</td>
                  {/* <td>{siswa.jurusan_ipa_key.nama_jurusan}</td>
                  <td>{siswa.univ_ipa_key.nama_univ}</td>
                  <td>{siswa.rumpun_ipa_key.nama_rumpun}</td>
                  <td>{siswa.tahun_aktif}</td> */}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="join pt-4 float-right">
            <button className="join-item btn bg-s-light border-0 py-1">«</button>
            <button className="join-item btn bg-s-light border-0 py-1">Page 22</button>
            <button className="join-item btn bg-s-light border-0 py-1">»</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TableSiswaEligible;
