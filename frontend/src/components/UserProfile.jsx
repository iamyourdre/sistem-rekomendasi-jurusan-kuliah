import React from 'react';
import { IoMdExit } from "react-icons/io";
import avatar from '../data/avatar.png';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { Logout, reset } from '../features/authSlice';
import { useStateContext } from '../contexts/ContextProvider';

const UserProfile = () => {
  const { handleClick } = useStateContext();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state)=>state.auth);

  const logout = () =>{
      dispatch(Logout());
      dispatch(reset());
      navigate("/login");
  }

  const handleLogout = () => {
    logout();
    handleClick('userProfile');
  }

  return (
    <div className="nav-item absolute right-4 top-20 bg-p-light shadow-md shadow-t-dark p-6 rounded-lg w-80 text-s-dark z-50">
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
          <p className="font-semibold text-lg">{user.name}</p>
          <p className="text-t-dark opacity-75 text-xs">Admin</p>
          <p className="text-t-dark opacity-75 text-xs font-semibold">{user.email}</p>
        </div>
      </div>
      <div className="mt-5">
        <button
          onClick={handleLogout}
          type="button"
          className="relative text-md rounded-lg p-2 bg-red-500 text-p-light w-full inline-block align-bottom"
        >
          <IoMdExit className='inline text-lg relative bottom-0.5'/> Logout
        </button>
      </div>
    </div>

  );
};

export default UserProfile;