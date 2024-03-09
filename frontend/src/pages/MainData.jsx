import React from 'react'
import { Breadcrumb, DataSiswaTable } from '../components'
import { FaCircleCheck, FaDiceD6, FaFlask, FaLandmark, FaUserGraduate } from "react-icons/fa6";

const MainData = () => {
  return (
    <>
      <div className="w-full">
        <Breadcrumb menu="Dashboard" submenu="Data Utama" />

        {/* Overview */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 px-4 md:px-8">
          <div className="bg-p-light p-6 rounded-lg flex border-b-1">
            <div className="flex-1">
              <span className="block font-semibold text-sm">Data Siswa</span>
              <p className="text-2xl pt-1 font-medium">35</p>
            </div>
            <div className="flex justify-center items-center w-14 h-14 bg-blue-200 rounded-full">
              <FaUserGraduate className='text-xl text-blue-500'/>
            </div>
          </div>
        
          <div className="bg-blue-200 p-6 rounded-lg flex border-b-1">
            <div className="flex-1">
              <span className="block font-semibold text-sm">Eligible</span>
              <p className="text-2xl pt-1 font-medium">35</p>
            </div>
            <div className="flex justify-center items-center w-14 h-14 bg-blue-400 rounded-full">
              <FaCircleCheck className='text-xl text-p-light'/>
            </div>
          </div>
          
          <div className="bg-orange-200 p-6 rounded-lg flex border-b-1">
            <div className="flex-1">
              <span className="block text-sm font-medium">Jurusan</span>
              <p className="text-2xl pt-1 font-medium">35</p>
            </div>
            <div className="flex justify-center items-center w-14 h-14 bg-orange-400 rounded-full">
              <FaFlask className='text-xl text-p-light'/>
            </div>
          </div>
          
          <div className="bg-pink-200 p-6 rounded-lg flex border-b-1">
            <div className="flex-1">
              <span className="block font-semibold text-sm">Universitas</span>
              <p className="text-2xl pt-1 font-medium">35</p>
            </div>
            <div className="flex justify-center items-center w-14 h-14 bg-pink-400 rounded-full">
              <FaLandmark className='text-xl text-p-light'/>
            </div>
          </div>
        </div>

        {/* Data Siswa Table */}
        <DataSiswaTable />

      </div>
    </>
  )
}

export default MainData
