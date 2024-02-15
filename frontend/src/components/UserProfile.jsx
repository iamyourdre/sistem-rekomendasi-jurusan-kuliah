import React from 'react';
import { IoMdExit } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";
import avatar from '../data/avatar.jpg';

const UserProfile = () => {

  return (
    <div className="nav-item absolute right-4 top-16 bg-p-light shadow-sm p-6 rounded-lg w-80 text-s-dark">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-md">Profil Saya</p>
      </div>
      <div className="flex gap-5 items-center mt-4 border-color border-b-1 pb-4">
        <img
          className="rounded-full h-16 w-16"
          src={avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-lg"> Michael Roberts </p>
          <p className="text-t-dark opacity-75 text-xs">  Administrator   </p>
          <p className="text-t-dark opacity-75 text-xs font-semibold"> info@shop.com </p>
        </div>
      </div>
      <div className="mt-5 flex">
        <div className="flex-auto w-5/6 pr-2">
          <button
            type="button"
            className="relative text-sm rounded-lg p-2 bg-blue-500 text-p-light w-full inline-block align-bottom"
          >
            <FaUserCog className='inline text-lg'/> Atur Akun
          </button>
        </div>
        <div className="flex-auto w-1/6">
          <button
            type="button"
            className="relative text-md rounded-lg p-2 bg-red-500 text-p-light w-full inline-block align-bottom"
          >
            <IoMdExit className='inline text-sm
            '/>
          </button>
        </div>
      </div>
    </div>

  );
};

export default UserProfile;