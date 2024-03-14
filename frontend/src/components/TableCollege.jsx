import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCircleInfo } from 'react-icons/fa6';

const TableCollege = () => {
  const [collegeData, setCollegeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    getCollegeData();
  }, []);

  const getCollegeData = async () => {
    const response = (await axios.get('http://localhost:5000/api/dataset/getAllCollege')).data;
    setCollegeData(response.data);
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCollegeData = collegeData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="p-4 md:px-8 md:pt-6">
      <div className="bg-p-light rounded-md p-6">
        <div role="alert" className="alert bg-t-light mb-3 inline-block">
          <FaCircleInfo className='inline text-lg relative bottom-0.5 mr-2'/>
          <span><b>{collegeData.length}</b> Jurusan Terlampaui</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="border-b-1 border-t-dark text-s-dark">
                <th>ID</th>
                <th>Jurusan</th>
                <th>Universitas</th>
                <th>Rumpun</th>
              </tr>
            </thead>
            <tbody>
              {currentCollegeData.map((college, index) => (
                <tr key={college.id}>
                  <td>{(index+1)+(indexOfLastItem - itemsPerPage)}</td>
                  <td>{college.jurusan}</td>
                  <td>{college.jurusan_ipa_key.map((univ) => (
                    <ul class="list-disc">
                      <li>{univ.univ_ipa_key.universitas}</li>
                    </ul>
                  ))}</td>
                  <td>{college.jurusan_ipa_key[0].rumpun_ipa_key.rumpun}</td>
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
            <button onClick={() => paginate(currentPage + 1)} className="join-item btn bg-s-light border-0 py-1 disabled:bg-s-light" disabled={indexOfLastItem >= collegeData.length}>»</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableCollege;
