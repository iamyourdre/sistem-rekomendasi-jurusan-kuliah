import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SiShopware } from 'react-icons/si'
import { FaXmark } from "react-icons/fa6";
import { TooltipComponent } from '@syncfusion/ej2-react-popups'

import { links } from '../data/constant'
import { useStateContext } from '../contexts/ContextProvider'

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <=900){
      setActiveMenu(false)
    }
  }

  const activeLink = 'flex items-center gap-5 pl-3 pt-3 pb-2.5 rounded-lg text-sm bg-s-light hover:bg-t-light mx-2 my-1'
  const normalLink = 'flex items-center gap-5 pl-3 pt-3 pb-2.5 rounded-lg text-sm hover:bg-s-light mx-2 my-1'

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
          {links.map((item) => (
            <div key={item.title}>
              <p className="text-s-dark opacity-65 text-xs font-semibold ms-3 mt-4 uppercase ">
                {item.title}
              </p>
              {item.links.map((link) => (
                <NavLink 
                  to={link.url}
                  key={link.name}
                  className={({isActive}) => isActive ? activeLink : normalLink}>
                    {link.icon}
                    <span>
                      {link.name}
                    </span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </>)}
    </div>
  )
}

export default Sidebar