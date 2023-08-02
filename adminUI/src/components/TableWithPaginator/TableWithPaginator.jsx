import './TableWithPaginator.scss';
import nextIcon from '../../imgs/next.png';
import backIcon from '../../imgs/back.png';
import editIcon from '../../imgs/edit.png';

const TableWithPaginator = (props) => {

  const handleEnterKeyUpPaginator = (e, direction) => {
    if (e.key == 'Enter' ) props.control.handlePaginatorClick(direction);
  }

  const handleEnterKeyUpTableRow = (e, row) => {
    if (e.key == 'Enter' ) props.rowClick(row);
  }

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
        <div 
          key={column + random.toString()} 
          style={headerStyles} 
          onClick={() => {props.rowClick(row)}}
          className={'table__row-column--' + column.value.toString().replace(/\s/g, '')}
        >
          {column.value}
        </div>
      );
     
    })
    if(headerCount > 2) {
      columns.push(
        <div  key={'edit' + random.toString()} className='table__row-edit-icon-container' onClick={() => {props.rowClick(row)}}> 
          <img src={editIcon} alt="edit" className='table__row-edit-icon' />
        </div>
      )
    }
    return (
      <div 
        className='flex-row table__content-row' 
        key={row + random.toString()}
        tabIndex={0}
        onKeyUp={(e) => {handleEnterKeyUpTableRow(e, row)}}
      >
        {columns}
      </div>
    );
  });

  const currentPageNumber = (props.control.currentPageIndex + 1).toString();
  const pageNumber = currentPageNumber + '/' + props.control.totalPages.toString();
  const tableClassName = props.control.type
    ? 'table table--' +  props.control.type
    : 'table';

  return (
    <div className={tableClassName}>
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
          {props.control.errorMessage}
        </div>
        
        <span className='table__page-number'>{pageNumber}</span> 
        <img 
          onClick={() => props.control.handlePaginatorClick('back')} 
          className='table__paginator-icon table__paginator-icon--back' 
          src={backIcon} 
          alt="back arrow"
          tabIndex={0}
          onKeyUp={(e) => {handleEnterKeyUpPaginator(e, 'back')}}
        />
        <img 
          onClick={() => props.control.handlePaginatorClick('next')} 
          className='table__paginator-icon table__paginator-icon--next' 
          src={nextIcon} 
          alt="next arrow"
          tabIndex={0}
          onKeyUp={(e) => {handleEnterKeyUpPaginator(e, 'next')}}

        />

      </div>

    </div>
  );

}

export default TableWithPaginator;