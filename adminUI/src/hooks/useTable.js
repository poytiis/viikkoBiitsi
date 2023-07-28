import {useEffect, useState} from 'react';

const useTable = (props) => {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerpage] = useState(props.rowsPerPage);

  const totalPages = Math.ceil(rows.length / props.rowsPerPage);

  const handlePaginatorClick = (direction) => {
    if (direction === 'next') {
      if(currentPageIndex < totalPages -1 ) {
        setCurrentPageIndex(currentPageIndex + 1);
      }
        
    } else if (direction === 'back') {
      if (currentPageIndex > 0) {
        setCurrentPageIndex(currentPageIndex -1);
      }
        
    } else {
      console.log('Invalid parameter');
    }   
  }

  const initializeRows = (rows) => {
    setRows(rows);
    setVisibleRows(rows.slice(currentPageIndex * props.rowsPerPage, currentPageIndex * props.rowsPerPage + props.rowsPerPage))
  }

  useEffect(() => {
    setVisibleRows(rows.slice(currentPageIndex * props.rowsPerPage, currentPageIndex * props.rowsPerPage + props.rowsPerPage))
  }, [currentPageIndex]);

  

  return {
      headers, 
      rows, 
      setHeaders, 
      setRows,
      visibleRows,
      handlePaginatorClick,
      currentPageIndex,
      totalPages,
      initializeRows
  }
}

export default useTable;
 