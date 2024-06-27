import React, { useState } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { FaBullseye, FaCircleCheck, FaCircleInfo, FaEye } from 'react-icons/fa6';

const TestingRunner = () => {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [truePos, setTruePos] = useState(0);
  const [falsePos, setFalsePos] = useState(0);

  const initiateProcessing = async () => {
    setIsProcessing(true);
    try {
      const eventSource = new EventSource('http://localhost:5000/api/testing/testingByLOOCV');

      eventSource.onmessage = (event) => {
        const newLog = JSON.parse(event.data);
        setLogs((prevLogs) => {
          const updatedLogs = [...prevLogs, newLog];
          let newTruePos = 0;
          let newFalsePos = 0;

          updatedLogs.forEach((log) => {
            if (log.testSet && log.eucDistResult) {
              if (log.testSet[0]["summary_key.jurusan_id"] === log.eucDistResult[0].jurusan_id) {
                newTruePos++;
              } else {
                newFalsePos++;
              }
            }
          });

          setTruePos(newTruePos);
          setFalsePos(newFalsePos);

          return updatedLogs;
        });
      };

      eventSource.addEventListener('done', (event) => {
        setMessage(event.data);
        eventSource.close();
      });

      eventSource.addEventListener('error', (event) => {
        console.error('Error:', event);
        eventSource.close();
      });

      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.error('Error initiating processing:', error);
    }
  };

  const handleStartProcessing = () => {
    if (!isProcessing) {
      initiateProcessing();
    }
  };

  return (
    <div className="px-4 md:px-8">
      <div className="bg-p-light rounded-md p-6">
        {message ? ( 
          <>
            <div role="alert" className="alert text-left bg-green-500 mb-3 inline-block rounded-md text-white text-sm">
              <FaCircleInfo className='inline text-md relative bottom-0.5 mr-2' />
              {message}
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 pb-6">
              <div className="bg-green-200 p-6 rounded-lg flex border-b-1">
                <div className="flex-1">
                  <span className="block font-semibold text-sm">True Positive</span>
                  <p className="text-2xl pt-1 font-medium">{truePos}</p>
                </div>
                <div className="flex justify-center items-center w-14 h-14 bg-green-400 rounded-full">
                  <FaCircleCheck className="text-xl text-white" />
                </div>
              </div>

              <div className="bg-red-200 p-6 rounded-lg flex border-b-1">
                <div className="flex-1">
                  <span className="block font-semibold text-sm">False Positive</span>
                  <p className="text-2xl pt-1 font-medium">{falsePos}</p>
                </div>
                <div className="flex justify-center items-center w-14 h-14 bg-red-400 rounded-full">
                  <FaTimesCircle className="text-xl" />
                </div>
              </div>

              <div className="bg-teal-200 p-6 rounded-lg flex border-b-1">
                <div className="flex-1">
                  <span className="block text-sm font-medium">Precision</span>
                  <p className="text-2xl pt-1 font-medium">{(truePos / (truePos + falsePos)).toFixed(3)}</p>
                </div>
                <div className="flex justify-center items-center w-14 h-14 bg-teal-400 rounded-full">
                  <FaBullseye className="text-xl text-white" />
                </div>
              </div>
            </div>
          </>
        ) : (isProcessing ? (
          <div role="alert" className="alert text-left bg-t-light mb-3 inline-block rounded-md text-neutral-700 text-sm">
            <span><b>Menjalankan Pengujian</b></span>
            <span className="loading loading-dots loading-sm relative -bottom-2 ml-2"></span>
          </div>
        ) : (
          <button 
            className="btn btn-primary mb-4" 
            onClick={handleStartProcessing}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Start Processing'}
          </button>
        ))}
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th>FOLD</th> 
                <th>ID SISWA</th> 
                <th>EKSPEKTASI</th> 
                <th>HASIL</th> 
                <th>PRESISI</th>
                <th>LOG</th>
              </tr>
            </thead> 
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <th>{index + 1}</th> 
                  <td>{log.testSet && log.testSet[0].id}</td>
                  <td>{log.testSet && log.testSet[0]["summary_key.jurusan_key.jurusan"]}</td> 
                  <td>{log.testSet && log.eucDistResult && log.eucDistResult[0].jurusan_key.jurusan}</td>
                  <td>
                    {(() => {
                      if (log.testSet && log.eucDistResult) {
                        if (log.testSet[0]["summary_key.jurusan_id"] === log.eucDistResult[0].jurusan_id) {
                          return (
                            <div className="badge badge-success gap-2 text-xs text-white">
                              True
                            </div>
                          );
                        } else {
                          return (
                            <div className="badge badge-error gap-2 text-xs text-white">
                              False
                            </div>
                          );
                        }
                      }
                    })()}
                  </td>
                  <td>
                    <button className="my-2" onClick={() => document.getElementById(`my_modal_${index}`).showModal()}><FaEye /></button>
                    <dialog id={`my_modal_${index}`} className="modal">
                      <div className="modal-box">
                        <form method="dialog">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Fold No.{index+1}</h3>
                        <div className='p-2 my-2 bg-slate-200 rounded-md text-xs'>
                          <pre><span className='font-semibold'>Test Set:</span> {JSON.stringify(log.testSet[0], null, 2)}</pre>
                        </div>
                        <div className='p-2 my-2 bg-slate-200 rounded-md text-xs'>
                          <pre><span className='font-semibold'>Recommended by System:</span> {JSON.stringify(log.eucDistResult[0], null, 2)}</pre>
                        </div>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                  </td>
                </tr>
              ))}
            </tbody> 
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestingRunner;
