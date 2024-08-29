import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCircleInfo, FaEye } from "react-icons/fa6";
import { FaTrash } from 'react-icons/fa';

const TableTestHistory = () => {
  const [testHistoryData, setTestHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTestHistory();
  }, []);

  const getTestHistory = async () => {
    setIsLoading(true);
    try {
      const response = (await axios.get('http://localhost:5000/api/testing/getTestHistory')).data;
      setTestHistoryData(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
    setIsLoading(false);
  };

  const deleteTestHistory = async (id) => {
    const isConfirmed = window.confirm(`Hapus riwayat pengujian no.${id} ?`);

    if (isConfirmed) {
      try {
        const response = await axios.delete("http://localhost:5000/api/testing/deleteTestHistory", {
          data: { id: id },
        });

        if (response.status === 200) {
          alert(response.data.message);
          getTestHistory();
        } else {
          alert("Gagal menghapus riwayat pengujian");
        }
      } catch (error) {
        console.error("Gagal menghapus riwayat pengujian:", error);
        alert("Gagal menghapus riwayat pengujian");
      }
    }
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTestHistoryData = testHistoryData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return (
      <div className='badge pr-0 bg-neutral-200 border-0'>
        {day}/{month}/{year}
        <p className="badge bg-neutral-400 border-0 gap-1 ml-1.5 px-1.5 text-white">
          {hours}:{minutes}:{seconds}
        </p>
      </div>
    );
  };

  return (
    <div className="px-4 md:px-8">
      <NavLink
        to='/dataset/testing' 
        className="btn bg-p-light border border-t-light mb-4 shadow-none"
      >
        <FaArrowLeft />&nbsp; Kembali
      </NavLink>
      <div className="bg-p-light rounded-md p-6">
        {isLoading ? (
          <div role="alert" className="alert bg-t-light mb-3 inline-block">
            <span><b>Memuat Data</b></span>
            <span className="loading loading-dots loading-sm relative -bottom-2 ml-1"></span>
          </div>
        ) : (
          <>
            <div role="alert" className="alert bg-t-light mb-3 inline-block">
              <FaCircleInfo className='inline text-lg relative bottom-0.5 mr-2'/>
              <span><b>{testHistoryData.length}</b> Riwayat Pengujian</span>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="border-b-1 border-t-dark text-s-dark">
                    <th>ID</th>
                    <th>Waktu Pengujian</th>
                    <th>
                      <div className="badge badge-success gap-2 text-xs text-white">
                        True Positive
                      </div>
                    </th>
                    <th>
                      <div className="badge badge-error gap-2 text-xs text-white">
                        False Positive
                      </div>
                    </th>
                    <th>
                      <div className="badge bg-amber-700 gap-2 text-xs text-white">
                        Presisi
                      </div>
                    </th>
                    <th>Data</th>
                    <th>Log</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTestHistoryData.map((history, index) => (
                    <tr key={index}>
                      <td>{history.id}</td> 
                      <td>{formatDate(history.updatedAt)}</td> 
                      <td>
                        <div className="badge badge-success gap-2 text-xs text-white">
                          {history.tp}
                        </div>
                      </td> 
                      <td>
                        <div className="badge badge-error gap-2 text-xs text-white">
                          {history.fp}
                        </div>
                      </td> 
                      <td>
                        <div className="badge bg-amber-700 gap-2 text-xs text-white">
                          {history.precision}
                        </div>
                      </td>
                      <td>{history.tp + history.fp}</td> 
                      <td>
                        <NavLink to={`/dataset/test_log/${history.id}`}>
                          <FaEye />
                        </NavLink>
                      </td>
                      <td>
                        <button onClick={() => deleteTestHistory(history.id)}>
                          <FaTrash className='text-red-500'/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right">
              <div className="join pt-4">
                <button onClick={() => paginate(currentPage - 1)} className="join-item btn bg-s-light border-0 py-1 disabled:bg-s-light" disabled={currentPage === 1}>«</button>
                <button className="join-item btn bg-s-light border-0 py-1">Page {currentPage}</button>
                <button onClick={() => paginate(currentPage + 1)} className="join-item btn bg-s-light border-0 py-1 disabled:bg-s-light" disabled={indexOfLastItem >= testHistoryData.length}>»</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TableTestHistory;
