import React, {useEffect} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Navbar, Sidebar, Footer } from './components';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';
import { Dashboard, Dataset, UpdateDataset } from './pages';

const App = () => {
  const { activeMenu } = useStateContext();
  return (
    <div>
      <BrowserRouter>
        <div className="flex relative">
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
            `bg-s-light min-h-screen w-full ${activeMenu ? 'md:ml-64' : 'flex-2'}`
          }>
            <div className="z-50 p-0">
              <Navbar />
            </div>
            <div className='w-full'>
              <Routes>
                {/* Dashboard */}
                <Route path='/' element={<Dashboard title="Halaman Utama" subtitle="Dashboard"/>}/>
                {/* Dashboard */}
                <Route path='/dataset/siswa_list' element={<Dataset title="Dataset" subtitle="Semua Siswa"/>}/>
                <Route path='/dataset/college_list' element={<Dataset title="Dataset" subtitle="Jurusan & Kampus"/>}/>
                <Route path='/dataset/siswa_eligible' element={<Dataset title="Dataset" subtitle="Siswa Eligible"/>}/>
                <Route path='/option/dataset/update' element={<UpdateDataset title="Pengaturan" subtitle="Update Dataset"/>}/>
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