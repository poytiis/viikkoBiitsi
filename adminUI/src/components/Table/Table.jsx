import React from 'react';
import './Table.scss';
import nextIcon from '../../imgs/next.png';
import backIcon from '../../imgs/back.png';
import editIcon from '../../imgs/edit.png';

const Table = (props) => {
  const headers = (props.headers || []).map((header, index) => {
    return(  
      <th className={'table__' + (index + 1).toString() +'-column'} key={header}>
        {header}
      </th>
      );
  });

  let points = 0;
  let content = null;
  if(props.players){
    content = (props.players || []).map(row => {
    points +=parseInt(row.score.value);
    const randomNumber = Math.floor(Math.random() * 100000);
    return(
      <tr className='table__body-row' key={row.name.value + randomNumber.toString()}>
        <td></td>   
        <td onClick={() => {props.rowClick(row)}}>{row.rank.value}</td>
        <td onClick={() => {props.rowClick(row)}}>{row.serie.value}</td>
        <td onClick={() => {props.rowClick(row)}}>{row.score.value}</td>
        <td onClick={() => {props.rowClick(row)}}>
          <span>{row.name.value}</span> 
          <img src={editIcon} alt="edit" className='table__edit-icon'/>
        </td>     
      </tr>
    );
  });

  } else if(props.logs) {
    content = props.logs.map(row => {
    const randomNumber = Math.floor(Math.random() * 100000);
    return (
      <tr className='table__body-row table__body-row--padding' key={row.merkinta + row.aikaleima + randomNumber.toString()}>
        <td>{}</td>
        <td>{row.aikaleima}</td>
        <td>{row.merkinta}</td>
      </tr>
    );
    })
  }
  let errorMessage =  null;
  if (isNaN(points)) {
    errorMessage = <span>Lohkon pisteet laskettu väärin: Lohkossa virheellisiä pisteitä</span>
  } else if (points !== 0) {
    errorMessage = <span>Lohkon pisteet laskettu väärin: {points}</span>
  }

  return (
    <div className='table__container'>
      <table style={props.style} className='table'>
        <thead className='table__header'>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody className='table__body'>
          {content}
        </tbody>
      </table>
      <div className='table__paginator flex-row-center'>
        <div className='table__paginator-error'>
          {errorMessage}
        </div>
        
       <span className='table__page-number'>{props.pageNumber}</span> 
       <img onClick={props.backClick} className='table__paginator-icon' src={backIcon} alt="back arrow"/>
       <img onClick={props.nextClick} className='table__paginator-icon' src={nextIcon} alt="next arrow"/>

      </div>
    </div>
  
  );
}

export default Table;
