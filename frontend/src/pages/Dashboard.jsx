import React, { useEffect, useState } from 'react';
import { Breadcrumb, TableSiswaEligible } from '../components';
import { FaCircleCheck, FaFlask, FaLandmark, FaUserGraduate } from 'react-icons/fa6';
import axios from 'axios';

const Dashboard = ({ title, subtitle }) => {
  const [dataLength, setDataLength] = useState({});

  useEffect(() => {
    getDataLength();
  }, []);

  const getDataLength = async () => {
    try {
      const response = (await axios.get('http://localhost:5000/api/master/getDataLength')).data;

      // Pastikan hanya menyimpan data primitif
      const formattedData = {
        eligLength: response.eligLength || 0,
        siswaLength: response.siswaLength || 0,
        jurusanLength: response.jurusanLength || 0,
        univLength: response.univLength || 0,
      };

      setDataLength(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <div className="w-full">
        <Breadcrumb menu={title} submenu={subtitle} />

        {/* Overview */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 px-4 md:px-8">
          <div className="bg-p-light p-6 rounded-lg flex border-b-1">
            <div className="flex-1">
              <span className="block font-semibold text-sm">Eligible</span>
              <p className="text-2xl pt-1 font-medium">{dataLength.eligLength}</p>
            </div>
            <div className="flex justify-center items-center w-14 h-14 bg-blue-200 rounded-full">
              <FaCircleCheck className="text-xl text-blue-500" />
            </div>
          </div>

          <div className="bg-blue-200 p-6 rounded-lg flex border-b-1">
            <div className="flex-1">
              <span className="block font-semibold text-sm">Total Siswa</span>
              <p className="text-2xl pt-1 font-medium">{dataLength.siswaLength}</p>
            </div>
            <div className="flex justify-center items-center w-14 h-14 bg-blue-400 rounded-full">
              <FaUserGraduate className="text-xl text-p-light" />
            </div>
          </div>

          <div className="bg-orange-200 p-6 rounded-lg flex border-b-1">
            <div className="flex-1">
              <span className="block text-sm font-medium">Jurusan</span>
              <p className="text-2xl pt-1 font-medium">{dataLength.jurusanLength-1}</p>
            </div>
            <div className="flex justify-center items-center w-14 h-14 bg-orange-400 rounded-full">
              <FaFlask className="text-xl text-p-light" />
            </div>
          </div>

          <div className="bg-pink-200 p-6 rounded-lg flex border-b-1">
            <div className="flex-1">
              <span className="block font-semibold text-sm">Universitas</span>
              <p className="text-2xl pt-1 font-medium">{dataLength.univLength-1}</p>
            </div>
            <div className="flex justify-center items-center w-14 h-14 bg-pink-400 rounded-full">
              <FaLandmark className="text-xl text-p-light" />
            </div>
          </div>
        </div>

        {/* Data Siswa Table */}
        <div className="mt-4">
          <TableSiswaEligible/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
