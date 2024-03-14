import React, { useEffect } from 'react'
import { Breadcrumb, TableSiswaEligible, TableCollege, TableAllSiswa } from '../components'

const Dataset = ({ title, subtitle }) => {

  // Mendapatkan alamat URL yang sedang diakses
  const currentPath = window.location.pathname;

  const isSiswaListPath = currentPath.includes("/siswa_list");
  const isCollegeListPath = currentPath.includes("/college_list");
  const isSiswaEligiblePath = currentPath.includes("/siswa_eligible");

  return (
    <>
      <div className="w-full">
        <Breadcrumb menu={title} submenu={subtitle} />

        {/* Kondisional untuk menampilkan TableSiswaEligible hanya jika alamat URL adalah siswa_eligible */}
        {isSiswaListPath && <TableAllSiswa />}
        {isCollegeListPath && <TableCollege />}
        {isSiswaEligiblePath && <TableSiswaEligible />}

      </div>
    </>
  )
}

export default Dataset
