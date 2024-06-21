import React, { useState } from 'react';
import { Breadcrumb } from '../components';
import { FaCircleInfo, FaDownload } from 'react-icons/fa6';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const UpdateDataset = ({ title, subtitle }) => {
  const [file, setFile] = useState(null);
  const [reset, setReset] = useState(false);
  const [progressStatus, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleResetChange = (e) => {
    setReset(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reset', reset ? 'y' : 'n');
  
    try {
      setProgress(1);
      const response1 = await axios.post('http://localhost:5000/api/siswa/upload', formData);
      setProgress(2);
      const response2 = await axios.post('http://localhost:5000/api/dataset/createTrainingData');
      setProgress(3);
      // Reset form jika diperlukan
      setFile(null);
      setReset(false);
    } catch (error) {
      setProgress(-1);
      if (error.response) {
        // Handle error based on error response from server
        console.error('Server Error:', error.response.data);
        console.error('Status Code:', error.response.status);
        console.error('Response Headers:', error.response.headers);
      } else if (error.request) {
        // Handle request error
        console.error('Request Error:', error.request);
      } else {
        // Handle other errors
        console.error('Error:', error.message);
      }
    }
  };
  
  return (
    <>
      <div className="w-full h-full min-h-screen">
        <Breadcrumb menu={title} submenu={subtitle} />
        <div className="px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-p-light rounded-md p-6">
              <div className="border-b-1 mb-4 pb-2">
                <span className='font-mono text-2xl font-bold mb-4'>LANGKAH 1</span>
              </div>
              <div role="alert" className="alert text-left bg-red-500 mb-3 inline-block rounded-md text-white text-sm">
                <FaCircleInfo className='inline text-md relative bottom-0.5 mr-2'/>
                <b>Note!</b>&nbsp;
                Untuk menginput dataset siswa, silahkan unduh dan gunakan template xlsx dibawah ini.
                <a
                  href="/assets/template_nilai_IPA.xlsx"
                  download="template_nilai_IPA.xlsx"
                  className="btn bg-p-light w-full mt-6"
                >
                  <FaDownload />  template_nilai_IPA.xlsx 
                </a>
              </div>
            </div>
            <div className="bg-p-light rounded-md p-6">
              <div className="border-b-1 mb-4 pb-2">
                <span className='font-mono text-2xl font-bold mb-4'>LANGKAH 2</span>
              </div>
              {/* Menampilkan pesan berhasil */}
              {progressStatus === 3 && (
                <div role="alert" className="alert bg-green-500 mb-3 inline-block">
                  <FaCircleInfo className='inline text-lg relative bottom-0.5 mr-2'/>
                  <span><b>(2/2)</b> Dataset berhasil diklasifikasi! <NavLink to='/'><b>Lihat disini.</b></NavLink></span>
                </div>
              )}
              {progressStatus === -1 && (
                <div role="alert" className="alert bg-red-500 mb-3 text-white inline-block">
                  <FaCircleInfo className='inline text-lg relative bottom-0.5 mr-2'/>
                  <span><b>(Error)</b> Pengklasifikasian dataset gagal! Coba lagi. </span>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                {/* Menyembunyikan form jika loading sedang berlangsung */}
                {progressStatus < 1 && (
                  <>
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">Upload Dataset</span>
                        <span className="label-text-alt">(.xlsx)</span>
                      </div>
                      <input type="file" className="file-input file-input-bordered w-full" onChange={handleFileChange} />
                    </label>
                    <div className="form-control pb-4">
                      <label className="label cursor-pointer inline">
                        <input type="checkbox" className="checkbox checkbox-sm top-1 relative mr-3 checkbox-error" onChange={handleResetChange} />
                        <span className="label-text">Ingin mereset data siswa sebelumnya?</span>
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary float-right">
                      Submit & Proses
                    </button>
                  </>
                )}
                {/* Menampilkan loading jika loading sedang berlangsung */}
                {progressStatus === 1 && (
                  <div role="alert" className="alert bg-t-light mb-3 inline-block">
                    <span><b>(0/2)</b> Mengupload dataset</span>
                    <span className="loading loading-dots loading-sm relative -bottom-2 ml-1"></span>
                  </div>
                )}
                {progressStatus === 2 && (
                  <div role="alert" className="alert bg-t-light mb-3 inline-block">
                    <span><b>(1/2)</b> Melakukan klasifikasi dataset</span>
                    <span className="loading loading-dots loading-sm relative -bottom-2 ml-1"></span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateDataset;
