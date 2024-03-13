import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableSiswaEligible = () => {
  const [siswaData, setSiswaData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    getSiswaData();
  }, []);

  const getSiswaData = async () => {
    const response = await axios.get('http://localhost:5000/api/dataset/getEligibleIpa');
    setSiswaData(response.data.data);
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSiswaData = siswaData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

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
                <th>Angkatan</th>
                <th>Jurusan</th>
                <th>Universitas</th>
                <th>Rumpun</th>
              </tr>
            </thead>
            <tbody>
              {currentSiswaData.map((siswa) => (
                <tr key={siswa.id}>
                  <td>{siswa.id}</td>
                  <td>{siswa.nama}</td>
                  <td>{siswa.akt_thn}</td>
                  <td>{siswa.jurusan_ipa_key.jurusan}</td>
                  <td>{siswa.univ_ipa_key.universitas}</td>
                  <td>{siswa.rumpun_ipa_key.rumpun}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="join pt-4 float-right">
            <button onClick={() => paginate(currentPage - 1)} className="join-item btn bg-s-light border-0 py-1 disabled:bg-s-light" disabled={currentPage === 1}>«</button>
            <button className="join-item btn bg-s-light border-0 py-1">Page {currentPage}</button>
            <button onClick={() => paginate(currentPage + 1)} className="join-item btn bg-s-light border-0 py-1 disabled:bg-s-light" disabled={indexOfLastItem >= siswaData.length}>»</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSiswaEligible;
