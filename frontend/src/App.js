import React, {useEffect} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Navbar, Sidebar, Footer } from './components';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';
import { Dashboard, Dataset, Evaluation, Srjk, UpdateDataset } from './pages';

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
                {/* Dashboard */}
                <Route path='/' element={<Dashboard title="Halaman Utama" subtitle="Dashboard"/>}/>
                {/* Dashboard */}

                <Route path='/dataset/siswa_list' element={<Dataset title="Dataset" subtitle="Semua Siswa"/>}/>
                <Route path='/dataset/college_list' element={<Dataset title="Dataset" subtitle="Jurusan & Kampus"/>}/>
                <Route path='/dataset/siswa_eligible' element={<Dataset title="Dataset" subtitle="Siswa Eligible"/>}/>
                <Route path='/dataset/update' element={<UpdateDataset title="Dataset" subtitle="Update Dataset"/>}/>
                <Route path='/dataset/evaluation' element={<Evaluation title="Dataset" subtitle="Evaluasi"/>}/>

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