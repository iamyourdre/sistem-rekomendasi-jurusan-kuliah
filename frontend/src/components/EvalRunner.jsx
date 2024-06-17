import React, { useEffect, useState } from 'react';
import { FaCircleInfo, FaEye } from 'react-icons/fa6';

const EvalRunner = () => {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initiateProcessing = async () => {
      try {
        const eventSource = new EventSource('http://localhost:5000/api/evaluation/evalLOOCV');

        eventSource.onmessage = (event) => {
          const newLog = JSON.parse(event.data);
          setLogs((prevLogs) => [...prevLogs, newLog]);
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

    initiateProcessing();
  }, []);

  return (
    <div className="px-4 md:px-8">
      <div className="bg-p-light rounded-md p-6">
        {message && 
          <div role="alert" className="alert text-left bg-green-500 mb-3 inline-block rounded-md text-white text-sm">
            <FaCircleInfo className='inline text-md relative bottom-0.5 mr-2' />
            {message}
          </div>
        }

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
                  <td>{log.testSet && log.eucDistResult && (log.testSet[0]["summary_key.jurusan_id"] === log.eucDistResult[0].jurusan_id ? (
                    <div className="badge badge-success gap-2 text-xs text-white">
                      True
                    </div>
                  ) : (
                    <div className="badge badge-error gap-2 text-xs text-white">
                      False
                    </div>
                  ))}</td>
                  {console.log(log)}
                  <td>
                    <button className="my-2" onClick={()=>document.getElementById(`my_modal_${index}`).showModal()}><FaEye /></button>
                    <dialog id={`my_modal_${index}`} className="modal">
                      <div className="modal-box">
                        <form method="dialog">
                          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Fold No.{index+1}</h3>
                        <div className='p-2 my-2 bg-slate-200 rounded-md text-xs'>
                          <pre><span className='font-semibold'>Test Set:</span> {JSON.stringify(log.testSet[0], null, 2)}</pre>
                        </div>
                        <div className='p-2 my-2 bg-slate-200 rounded-md text-xs'>
                          <pre><span className='font-semibold'>Recommended by System:</span> {JSON.stringify(log.probData[0], null, 2)}</pre>
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

export default EvalRunner;
