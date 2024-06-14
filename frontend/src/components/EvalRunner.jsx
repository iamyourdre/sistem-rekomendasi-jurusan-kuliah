import React, { useEffect, useState } from 'react'
import axios from 'axios';

const EvalRunner = () => {

  const [dataset, setDataset] = useState({});

  useEffect(() => {
    getDataset();
  }, []);

  const getDataset = async () => {
    try {
      const response = (await axios.get('http://localhost:5000/api/utils/getDataset')).data;

      setDataset(response);
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>EvalRunner</div>
  )
}

export default EvalRunner