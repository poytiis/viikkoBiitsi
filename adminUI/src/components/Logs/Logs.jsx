import React, {useEffect, useState} from 'react';
import './Logs.scss';
import Layout from '../Layout/Layout';
import Table from '../Table/Table';
import { fetchLogsAjax } from '../../services/httpClient';

const Logs = () => {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogsAjax()
      .then(res => {
        console.log(res.data.data)
        console.log(res.data)
        setLogs(res.data.data);
      })
  }, []);

  const tableHeaders = ['lokiaika', 'Merkintä'];
  return (
    <Layout>
      <div className='logs flex-column-center'>
        <h2 className='logs__header'>Järjestelmän lokimerkinnät</h2>
        <Table headers={tableHeaders} logs={logs}/>
      </div>

    </Layout>
    
  );
}

export default Logs;
