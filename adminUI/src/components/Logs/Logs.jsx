import React, {useEffect, useState} from 'react';
import './Logs.scss';
import Layout from '../Layout/Layout';
import Table from '../Table/Table';
import { fetchLogsAjax } from '../../services/httpClient';

const Logs = () => {
  const logsCountInTablePage = 6;
  const [logs, setLogs] = useState([]);
  const [tablePageCount, setTablePageCount] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    fetchLogsAjax()
      .then(res => {
        const logsData = res.data.data;
        const logsPageCount = Math.ceil(logsData.length / logsCountInTablePage);
        setTablePageCount(logsPageCount);
        // console.log(res.data.data)
        setLogs(logsData.reverse());
      })
  }, []);

  const handleNextPaginatorClick = () => {
    if(currentPageIndex + 1 < tablePageCount) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePreviousPaginatorClick = () => {
    if (currentPageIndex !== 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  }

  const tableHeaders = ['','Lokiaika', 'Merkintä'];
  let slicedLogs = [];
  if(currentPageIndex * logsCountInTablePage + logsCountInTablePage <= logs.length) {
    slicedLogs = logs.slice(currentPageIndex * logsCountInTablePage, currentPageIndex * logsCountInTablePage + logsCountInTablePage)
  } else {
    slicedLogs = logs.slice(currentPageIndex * logsCountInTablePage, logs.length -1)
  }
  const pageNumber = (currentPageIndex + 1).toString() + '/' + tablePageCount.toString();
  return (
    <Layout>
      <div className='logs flex-column-center'>
        <h2 className='logs__header'>Järjestelmän lokimerkinnät</h2>
        <Table 
          headers={tableHeaders} 
          logs={slicedLogs}
          nextClick={handleNextPaginatorClick}
          backClick={handlePreviousPaginatorClick}
          pageNumber={pageNumber}
          />
      </div>

    </Layout>
    
  );
}

export default Logs;
