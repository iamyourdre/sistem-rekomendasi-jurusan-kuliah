import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaTimesCircle, FaTrash } from 'react-icons/fa';
import { FaBullseye, FaCircleCheck, FaEye, FaArrowLeft } from 'react-icons/fa6';
import { NavLink, useNavigate } from 'react-router-dom';

const TableTestLog = ({ id }) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTestHistory();
  }, []);

  const getTestHistory = async () => {
    setIsLoading(true);
    try {
      const response = (await axios.get(`http://localhost:5000/api/testing/getTestLog/${id}`)).data;
      setLogs(response);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
    setIsLoading(false);
  };
  
  const deleteTestHistory = async (id) => {
    const isConfirmed = window.confirm(`Hapus riwayat pengujian ini?`);

    if (isConfirmed) {
      try {
        const response = await axios.delete("http://localhost:5000/api/testing/deleteTestHistory", {
          data: { id: id },
        });

        if (response.status === 200) {
          alert(response.data.message);
          navigate("/dataset/test_history");
        } else {
          alert("Gagal menghapus riwayat pengujian");
        }
      } catch (error) {
        console.error("Gagal menghapus riwayat pengujian:", error);
        alert("Gagal menghapus riwayat pengujian");
      }
    }
  };

  return (
    <div className="px-4 md:px-8">
      <div className=''>
        <NavLink
          to='/dataset/test_history' 
          className="btn bg-p-light border border-t-light mb-4"
        >
          <FaArrowLeft />&nbsp; Kembali
        </NavLink>
        <button
          onClick={() => deleteTestHistory(id)}
          className="btn bg-red-500 border mb-4 float-end"
        >
          <FaTrash />
        </button>
      </div>
      <div className="bg-p-light rounded-md p-6">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 pb-6">
          <div className="bg-green-200 p-6 rounded-lg flex border-b-1">
            <div className="flex-1">
              <span className="block font-semibold text-sm">True Positive</span>
              <p className="text-2xl pt-1 font-medium">{logs.testHistory && logs.testHistory.tp}</p>
            </div>
            <div className="flex justify-center items-center w-14 h-14 bg-green-400 rounded-full">
              <FaCircleCheck className="text-xl text-white" />
            </div>
          </div>

          <div className="bg-red-200 p-6 rounded-lg flex border-b-1">
            <div className="flex-1">
              <span className="block font-semibold text-sm">False Positive</span>
              <p className="text-2xl pt-1 font-medium">{logs.testHistory && logs.testHistory.fp}</p>
            </div>
            <div className="flex justify-center items-center w-14 h-14 bg-red-400 rounded-full">
              <FaTimesCircle className="text-xl" />
            </div>
          </div>

          <div className="bg-teal-200 p-6 rounded-lg flex border-b-1">
            <div className="flex-1">
              <span className="block text-sm font-medium">Precision</span>
              <p className="text-2xl pt-1 font-medium">{logs.testHistory && (logs.testHistory.tp / (logs.testHistory.tp + logs.testHistory.fp)).toFixed(3)}</p>
            </div>
            <div className="flex justify-center items-center w-14 h-14 bg-teal-400 rounded-full">
              <FaBullseye className="text-xl text-white" />
            </div>
          </div>
        </div>
        {isLoading ? (
          <div role="alert" className="alert text-left bg-t-light mb-3 inline-block rounded-md text-neutral-700 text-sm">
            <span><b>Memuat Data</b></span>
            <span className="loading loading-dots loading-sm relative -bottom-2 ml-2"></span>
          </div>
        ) : ('')}
        <hr className='pb-6'/>
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th>#</th> 
                <th>ID SISWA</th> 
                <th>EKSPEKTASI</th> 
                <th>HASIL</th> 
                <th>PRESISI</th>
                <th>LOG</th>
              </tr>
            </thead> 
            <tbody>
              {logs.testLog && logs.testLog.map((log, index) => (
                <tr key={index}>
                  <th>{index + 1}</th> 
                  <td>{log && log.id_siswa}</td>
                  <td>{log && log.expected}</td> 
                  <td>{log && log.result}</td>
                  <td>
                    {(log && log.precision) ? (
                        <div className="badge badge-success gap-2 text-xs text-white">
                          True
                        </div>
                      ) : (
                        <div className="badge badge-error gap-2 text-xs text-white">
                          False
                        </div>
                      )
                    }
                  </td>
                  <td>
                    <button className="my-2" onClick={() => document.getElementById(`my_modal_${index}`).showModal()}><FaEye /></button>
                    <dialog id={`my_modal_${index}`} className="modal">
                      <div className="modal-box">
                        <form method="dialog">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Iter {index+1}</h3>
                        <div className='p-2 my-2 bg-slate-200 rounded-md text-xs'>
                          <pre><span className='font-semibold'>Test Set:</span> {log.log_testset}</pre>
                        </div>
                        <div className='p-2 my-2 bg-slate-200 rounded-md text-xs'>
                          <pre><span className='font-semibold'>Recommended by System:</span> {log.log_recommendation}</pre>
                        </div>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                  </td>
                </tr>
              ))}
            </tbody> 
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableTestLog;
