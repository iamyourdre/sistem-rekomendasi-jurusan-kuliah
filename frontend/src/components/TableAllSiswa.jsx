import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCircleInfo } from 'react-icons/fa6';

const TableAllSiswa = () => {
  const [siswaData, setSiswaData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    getSiswaData();
  }, []);

  const getSiswaData = async () => {
    const response = (await axios.get('http://localhost:5000/api/dataset/getAllIpa')).data;
    setSiswaData(response.data);
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSiswaData = siswaData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="p-4 md:px-8 md:pt-6">
      <div className="bg-p-light rounded-md p-6">
        <div role="alert" className="alert bg-t-light mb-3 inline-block">
          <FaCircleInfo className='inline text-lg relative bottom-0.5 mr-2'/>
          <span><b>{siswaData.length}</b> Data Siswa</span>
        </div>
        <div className="overflow-x-auto">
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
              {currentSiswaData.map((siswa, index) => (
                <tr key={siswa.id}>
                  <td>{(index+1)+(indexOfLastItem - itemsPerPage)}</td>
                  <td>{siswa.nama}</td>
                  <td>{siswa.akt_thn}</td>
                  <td>{siswa.jurusan_ipa_key.jurusan}</td>
                  <td>{siswa.univ_ipa_key.universitas}</td>
                  <td>{siswa.rumpun_ipa_key.rumpun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="text-right">
          <div className="join pt-4">
            <button onClick={() => paginate(currentPage - 1)} className="join-item btn bg-s-light border-0 py-1 disabled:bg-s-light" disabled={currentPage === 1}>«</button>
            <button className="join-item btn bg-s-light border-0 py-1">Page {currentPage}</button>
            <button onClick={() => paginate(currentPage + 1)} className="join-item btn bg-s-light border-0 py-1 disabled:bg-s-light" disabled={indexOfLastItem >= siswaData.length}>»</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableAllSiswa;
