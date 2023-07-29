import {useEffect, useState} from 'react';

const useTable = (props) => {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

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
    setNewRows(rows)
  }

  useEffect(() => {
    setNewRows()
  }, [currentPageIndex]);

  const setNewRows = (newRows = rows) => {
    const newVisibleRows = newRows.slice(currentPageIndex * props.rowsPerPage, currentPageIndex * props.rowsPerPage + props.rowsPerPage)
    setVisibleRows(newVisibleRows)
    if (props.type === 'scores') {
      const totalScores = newVisibleRows.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue[2].value), 0);
      if (isNaN(totalScores)) {
        setErrorMessage('Lohkossa virheellisiä pisteitä!');
      }
      else if (totalScores !== 0) {
        setErrorMessage('Lohkon pisteet laskettu väärin: ' + totalScores.toString());
      }
      else if (errorMessage !== '')  {
        setErrorMessage('')
      }
    }  
  }

  return {
    headers, 
    rows, 
    setHeaders, 
    setRows,
    visibleRows,
    handlePaginatorClick,
    currentPageIndex,
    totalPages,
    initializeRows,
    errorMessage
  }
}

export default useTable;
 