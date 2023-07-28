import {useState} from 'react';
import './TableWithPaginator.scss';
import nextIcon from '../../imgs/next.png';
import backIcon from '../../imgs/back.png';
import editIcon from '../../imgs/edit.png';

const TableWithPaginator = (props) => {

  const headerCount = props.control.headers.length;
  const headerWidth = 95 / headerCount;
  const headerStyles = {
    width: headerWidth.toString() + '%'
  };

  const headers = props.control.headers.map(header => {
    let random =  Math.floor(Math.random() * 1000000);
    return (
      <div key={header + random.toString()} className='' style={headerStyles} >{header}</div>
    );

  });

  const content = props.control.visibleRows.map(row => {
    let random =  Math.floor(Math.random() * 1000000);
    const columns = row.map(column => {
      random =  Math.floor(Math.random() * 1000000);
      return(
        <div key={column + random.toString()} style={headerStyles} onClick={() => {props.rowClick(row)}}>{column.value}</div>
      );
     
    })
    if(headerCount > 2) {
      columns.push(
        <div style={headerStyles} key={'edit' + random.toString()} className='table__row-edit-icon-container' onClick={() => {props.rowClick(row)}}> 
          <img src={editIcon} alt="edit" className='table__row-edit-icon' />
        </div>
      )
    }
    return (
      <div className='flex-row table__content-row' key={row + random.toString()} >
        {columns}
      </div>
    );
  });

  let points = 0;

  let errorMessage =  null;
  if (isNaN(points)) {
    errorMessage = <span>Lohkon pisteet laskettu väärin: Lohkossa virheellisiä pisteitä</span>
  } else if (points !== 0) {
    errorMessage = <span>Lohkon pisteet laskettu väärin: {points}</span>
  }

  const currentPageNumber = (props.control.currentPageIndex + 1).toString();
  const pageNumber = currentPageNumber + '/' + props.control.totalPages.toString();

  return (
    <div className='table'>
      <div className='table__content'> 
      <div className='table__content-header'>
        <div className='table__content-header-content flex-row'> 
          {headers}
        </div>

      </div>

      <div className='table__content-body'>
        {content}
      </div>

      </div>

      <div className='table__paginator flex-row-center'>
        <div className='table__paginator-error'>
          {errorMessage}
        </div>
        
       <span className='table__page-number'>{pageNumber}</span> 
       <img onClick={() => props.control.handlePaginatorClick('back')} className='table__paginator-icon' src={backIcon} alt="back arrow"/>
       <img onClick={() => props.control.handlePaginatorClick('next')} className='table__paginator-icon' src={nextIcon} alt="next arrow"/>

      </div>

    </div>
  );

}

export default TableWithPaginator;