const DataSiswaTable = () => {
  return (
    <div className="p-4 md:px-8 md:pt-6">
      <div className="bg-p-light rounded-md">
        <span className="p-6">
          
        </span>
        <div className="overflow-x-auto p-6">
          
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="border-b-1 border-t-dark text-s-dark">
                <th>ID</th>
                <th>Nama Siswa</th>
                <th>Jurusan</th>
                <th>Universitas</th>
                <th>Rumpun</th>
                <th>Tahun Aktif</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <td>1</td>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
                <td>...</td> {/* Isi dengan rumpun siswa */}
                <td>...</td> {/* Isi dengan tahun aktif siswa */}
              </tr>
              {/* row 2 */}
              <tr>
                <td>2</td>
                <td>Hart Hagerty</td>
                <td>Desktop Support Technician</td>
                <td>Purple</td>
                <td>...</td> {/* Isi dengan rumpun siswa */}
                <td>...</td> {/* Isi dengan tahun aktif siswa */}
              </tr>
            </tbody>
          </table>

          <div className="join pt-4 float-right">
            <button className="join-item btn bg-s-light border-0 py-1">«</button>
            <button className="join-item btn bg-s-light border-0 py-1">Page 22</button>
            <button className="join-item btn bg-s-light border-0 py-1">»</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DataSiswaTable
