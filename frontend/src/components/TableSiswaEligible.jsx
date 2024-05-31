import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCircleInfo } from "react-icons/fa6";

const TableSiswaEligible = () => {
  const [siswaData, setSiswaData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSiswaData();
  }, []);

  const getSiswaData = async () => {
    setIsLoading(true);
    try {
      const response = (await axios.get('http://localhost:5000/api/dataset/getSiswaEligible')).data;
      setSiswaData(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
    setIsLoading(false);
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSiswaData = siswaData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="px-4 md:px-8">
      <div className="bg-p-light rounded-md p-6">
        {isLoading ? (
          <div role="alert" className="alert bg-t-light mb-3 inline-block">
            <span><b>Memuat Data</b></span>
            <span class="loading loading-dots loading-sm relative -bottom-2 ml-1"></span>
          </div>
        ) : (
          <>
          <div role="alert" className="alert bg-t-light mb-3 inline-block">
            <FaCircleInfo className='inline text-lg relative bottom-0.5 mr-2'/>
            <span><b>{siswaData.length}</b> Siswa Eligible</span>
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
                    <td>{siswa.jurusan_key.jurusan}</td>
                    <td>{siswa.univ_key.universitas}</td>
                    <td>{siswa.rumpun_key.rumpun}</td>
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
          </>
        )}
      </div>
    </div>
  );
};

export default TableSiswaEligible;
