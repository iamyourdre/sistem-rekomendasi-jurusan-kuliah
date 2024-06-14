import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SiShopware } from 'react-icons/si'
import { FaXmark } from "react-icons/fa6";
import { TooltipComponent } from '@syncfusion/ej2-react-popups'

import { useStateContext } from '../contexts/ContextProvider'
import { TbCategory, TbDatabasePlus, TbDatabaseSearch, TbDatabaseStar, TbFlower } from 'react-icons/tb';

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <=900){
      setActiveMenu(false)
    }
  }

  const activeLink = 'flex items-center gap-5 pl-3 pt-3 pb-2.5 text-sm font-medium rounded-lg bg-s-light hover:bg-t-light mt-1'
  const normalLink = 'flex items-center gap-5 pl-3 pt-3 pb-2.5 text-sm font-medium rounded-lg hover:bg-s-light mt-1'

  return (
    <div className='px-3 py-4 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 bg-p-light'>
      {activeMenu && (<>
        <div className="flex justify-between items-center">
          <Link to="/" className="items-center gap-3 ml-3 py-3 flex text-xl font-extrabold tracking-tight text-blue-500">
            <SiShopware/> <span>SRJK</span>
          </Link>
          <TooltipComponent content="Tutup">
            <button
              type='button'
              onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} 
              className="relative text-xl rounded-full p-3 mr-2 bg-s-light inline md:hidden"
            >
              <span
                className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
              />
              <FaXmark />
            </button>
          </TooltipComponent>
        </div>

        <div className="mt-10 ">

          <p className="text-s-dark opacity-65 text-xs font-semibold ms-3 mt-4 uppercase ">
            Halaman Utama
          </p>
          <NavLink to='' className={({isActive}) => isActive ? activeLink : normalLink} onClick={() => handleCloseSideBar()}>
            <TbCategory className='text-lg'/>
            <span>
              Dashboard
            </span>
          </NavLink>

          <p className="text-s-dark opacity-65 text-xs font-semibold ms-3 mt-4 uppercase ">
            Fitur
          </p>
          <NavLink to='feature/srjk' className={({isActive}) => isActive ? activeLink : normalLink} onClick={() => handleCloseSideBar()}>
            <TbFlower className='text-lg'/>
            <span>
              Rekomendasi Jurusan
            </span>
          </NavLink>

          <p className="text-s-dark opacity-65 text-xs font-semibold ms-3 mt-4 mb-1 uppercase ">
            Dataset
          </p>
          <div className="collapse collapse-arrow">
            <input type="radio" name="my-accordion" className='p-0 m-0 min-h-0'/>
            <div className="collapse-title gap-5 pl-3 pt-3 pb-2.5 rounded-lg hover:bg-s-light focus:rounded-b-none focus:bg-s-light cursor-pointer w-auto min-h-0 text-sm font-medium">
              <TbDatabaseSearch className='inline mr-5 relative text-lg bottom-0.5'/>
              <span>
                Lihat Data
              </span>
            </div>
            <div className="collapse-content px-2 m-0 border-b-1 border-t-light">
              <NavLink to='dataset/siswa_list' className={({isActive}) => isActive ? activeLink : normalLink} onClick={() => handleCloseSideBar()}>Semua Siswa</NavLink>
              <NavLink to='dataset/college_list' className={({isActive}) => isActive ? activeLink : normalLink} onClick={() => handleCloseSideBar()}>Jurusan & Kampus</NavLink>
              <NavLink to='dataset/siswa_eligible' className={({isActive}) => isActive ? activeLink : normalLink} onClick={() => handleCloseSideBar()}>Siswa Eligible</NavLink>
            </div>
          </div>
          
          <div className="collapse collapse-arrow">
            <input type="radio" name="my-accordion" className='p-0 m-0 min-h-0'/>
            <div className="collapse-title gap-5 pl-3 pt-3 pb-2.5 rounded-lg hover:bg-s-light focus:rounded-b-none focus:bg-s-light cursor-pointer w-auto min-h-0 text-sm font-medium">
              <TbDatabaseStar className='inline mr-5 relative text-lg bottom-0.5'/>
              <span>
                Pengaturan
              </span>
            </div>
            <div className="collapse-content px-2 m-0 border-b-1 border-t-light">
              <NavLink to='/dataset/update' className={({isActive}) => isActive ? activeLink : normalLink} onClick={() => handleCloseSideBar()}>Update Dataset</NavLink>
            </div>
          </div>
          
          <NavLink to='/dataset/evaluation' className={({isActive}) => isActive ? activeLink : normalLink} onClick={() => handleCloseSideBar()}>
            <TbFlower className='text-lg'/>
            <span>
              Evaluasi
            </span>
          </NavLink>

        </div>
      </>)}
    </div>
  )
}

export default Sidebar