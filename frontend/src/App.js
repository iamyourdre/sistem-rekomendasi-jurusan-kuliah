import React, {useEffect} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Navbar, Sidebar } from './components';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';
import { MainData } from './pages';

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
            <div className='flex relative'>
              <Routes>
                {/* Dashboard */}
                <Route path='/' element={<MainData/>}/>
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App