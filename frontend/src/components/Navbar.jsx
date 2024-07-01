import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';

import avatar from '../data/avatar.png';
import { UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { useSelector } from 'react-redux';

const Navbar = () => {

  const { user } = useSelector((state)=>state.auth);

  const { activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="flex justify-between relative p-4 md:px-8 md:py-6">

      <button
        type="button"
        onClick={() => handleActiveMenu()}
        className="relative text-xl rounded-lg p-3 bg-t-light"
      >
        <AiOutlineMenu/>
      </button>

      {user && user.role === 1 && (
      <div className="flex justify-items-end">
        <div
          className="flex items-center gap-2 cursor-pointer py-1 px-2 hover:bg-t-light rounded-lg"
          onClick={() => handleClick('userProfile')}
        >
          <img
            className="rounded-full w-8 h-8"
            src={avatar}
            alt="user-profile"
          />
          <p>
            <span className="text-14">Hi,</span>
            <span className="font-bold ml-1 text-14">
            {user.name}
            </span>
          </p>
          <MdKeyboardArrowDown className="text-s-dark opacity-50 text-14" />
        </div>

        {isClicked.userProfile && (<UserProfile />)}
      </div>
      )}

    </div>
  );
};

export default Navbar;