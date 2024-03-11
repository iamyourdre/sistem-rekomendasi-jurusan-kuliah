import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SiShopware } from 'react-icons/si'
import { FaXmark } from "react-icons/fa6";
import { TooltipComponent } from '@syncfusion/ej2-react-popups'

import { useStateContext } from '../contexts/ContextProvider'
import { TbDatabasePlus, TbDatabaseStar } from 'react-icons/tb';

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <=900){
      setActiveMenu(false)
    }
  }

  const activeLink = 'flex items-center gap-5 pl-3 pt-3 pb-2.5 rounded-lg text-sm bg-s-light hover:bg-t-light my-1'
  const normalLink = 'flex items-center gap-5 pl-3 pt-3 pb-2.5 rounded-lg text-sm hover:bg-s-light my-1'

  return (
    <div className='px-2 py-4 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 bg-p-light'>
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

          <NavLink to='' className={({isActive}) => isActive ? activeLink : normalLink}>
            <TbDatabaseStar />
            <span>
              Dashboard
            </span>
          </NavLink>

          <p className="text-s-dark opacity-65 text-xs font-semibold ms-3 mt-4 uppercase ">
            Dataset
          </p>

          <div  className="dropdown dropdown-end cursor-pointer w-full">
            <div tabIndex={0} role="button" className='flex items-center gap-5 pl-3 pt-3 pb-2.5 rounded-lg text-sm hover:bg-s-light focus:rounded-b-none focus:bg-s-light cursor-pointer w-auto mt-1'>
              <TbDatabasePlus />
              <span>
                Lihat Data
              </span>
            </div >
            <div tabIndex={0} className="dropdown-content z-[1] w-full shadow rounded-b-lg text-sm bg-base-100 p-2">
              <NavLink to='dataset/siswa_list' className={({isActive}) => isActive ? activeLink : normalLink}>Semua Siswa</NavLink>
              <NavLink to='dataset/college_list' className={({isActive}) => isActive ? activeLink : normalLink}>Jurusan & Kampus</NavLink>
              <NavLink to='dataset/siswa_eligible' className={({isActive}) => isActive ? activeLink : normalLink}>Siswa Eligible</NavLink>
            </div>
          </div>

        </div>
      </>)}
    </div>
  )
}

export default Sidebar