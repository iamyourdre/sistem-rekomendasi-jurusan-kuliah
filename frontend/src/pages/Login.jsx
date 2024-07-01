import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from '../features/authSlice';
import { FaCircleExclamation } from "react-icons/fa6";

const Login = ({ title, subtitle }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

    const Auth = async (e) => {
        e.preventDefault();
        const result = await dispatch(LoginUser({ email, password }));
        if (result.meta.requestStatus === 'fulfilled') {
            navigate("/");
            dispatch(reset());
        }
    };

    return (
        <div className="w-full mt-8">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Masuk ke Akun
                        </h1>
                        {isError &&
                        <div className="flex items-center bg-red-500 text-white text-sm font-bold px-4 py-3" role="alert">
                            <FaCircleExclamation className='inline mr-2 text-lg'/>
                            <p>{message}</p>
                        </div>
                        }
                        <form className="space-y-4 md:space-y-6" onSubmit={Auth}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email Anda</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required="" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Kata Sandi</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " value={password} onChange={(e) => setPassword(e.target.value)} required="" />
                            </div>
                            <button type="submit" className="w-full text-white bg-slate-950 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">{isLoading ? 'Memproses..' : 'Masuk'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
