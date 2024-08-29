import React from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

import { Navbar, Sidebar, Footer } from './components';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';
import { Dashboard, Dataset, Testing, Srjk, UpdateDataset, TestHistory, TestLog } from './pages';
import Login from './pages/Login';
import { FaCircleChevronRight } from 'react-icons/fa6';

const App = () => {
  const { activeMenu } = useStateContext();
  return (
    <div>
      <BrowserRouter>
        <div className="flex relative min-h-dvh">
          {activeMenu ? (
              <div className='w-64 fixed sidebar'>
                  <Sidebar/>
              </div>
          ) : (
              <div className='w-0 '>
                  <Sidebar/>
              </div>
          )}
          <div className={
            `bg-s-light w-full ${activeMenu ? 'md:pl-64' : 'flex-2'}`
          }>
            <div className="z-50 p-0">
              <Navbar />
            </div>
            <div className='w-full'>
              <Routes>

                <Route path='/login' element={<Login title="Auth" subtitle="Login"/>}/>
                
                {/* Dashboard */}
                <Route path='/' element={<Dashboard title="Halaman Utama" subtitle="Dashboard"/>}/>
                {/* Dashboard */}

                <Route path='/dataset/siswa_list' element={<Dataset title="Dataset" subtitle="Semua Siswa"/>}/>
                <Route path='/dataset/college_list' element={<Dataset title="Dataset" subtitle="Jurusan & Kampus"/>}/>
                <Route path='/dataset/siswa_eligible' element={<Dataset title="Dataset" subtitle="Siswa Eligible"/>}/>
                <Route path='/dataset/update' element={<UpdateDataset title="Dataset" subtitle="Update Dataset"/>}/>
                <Route path='/dataset/testing' element={<Testing title="Fitur" subtitle="Pengujian"/>}/>
                <Route path='/dataset/test_history' element={<TestHistory title="Fitur" subtitle={
                  <>
                    <NavLink to='/dataset/testing' className="hover:underline">Pengujian</NavLink>
                    <FaCircleChevronRight className="inline text-xs mx-3 relative bottom-0.5"/>
                    <span className='font-bold'>Riwayat Pengujian</span>
                  </>
                }/>}/>
                <Route path='/dataset/test_log/:id' element={<TestLog title="Fitur" subtitle={
                  <>
                    <NavLink to='/dataset/testing' className="hover:underline">Pengujian</NavLink>
                    <FaCircleChevronRight className="inline text-xs mx-3 relative bottom-0.5"/>
                    <NavLink to='/dataset/test_history' className="hover:underline">Riwayat Pengujian</NavLink>
                    <FaCircleChevronRight className="inline text-xs mx-3 relative bottom-0.5"/>
                    <span className='font-bold'>Log</span>
                  </>
                }/>}/>

                <Route path='/feature/srjk' element={<Srjk title="Fitur" subtitle="Rekomendasi Jurusan"/>}/>
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App