import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import TableWithPaginator from './TableWithPaginator';
import useTable from '../../hooks/useTable';
import {render, fireEvent, screen} from '@testing-library/react';

const testLogRows = [
  [{value: 'testTimeStamp1'}, {value: 'testLog1'}],
  [{value: 'testTimeStamp2'}, {value: 'testLog2'}],
  [{value: 'testTimeStamp3'}, {value: 'testLog3'}],
  [{value: 'testTimeStamp4'}, {value: 'testLog4'}],
  [{value: 'testTimeStamp5'}, {value: 'testLog5'}],
  [{value: 'testTimeStamp6'}, {value: 'testLog6'}],
  [{value: 'testTimeStamp7'}, {value: 'testLog7'}],
  [{value: 'testTimeStamp8'}, {value: 'testLog8'}],
  [{value: 'testTimeStamp9'}, {value: 'testLog9'}],
];

const testLogHeaders = ['Lokiaika', 'Merkintä'];

const testInvalidScoreRows = [
  [{value: '1'}, {value: 'Naiset'}, {value: '1'}, {value: 'Test1'}],
  [{value: '1'}, {value: 'Naiset'}, {value: '-1'}, {value: 'Test2'}],
  [{value: '1'}, {value: 'Naiset'}, {value: '2'}, {value: 'Test3'}],
  [{value: '1'}, {value: 'Naiset'}, {value: '-20'}, {value: 'Test4'}],
  [{value: '2'}, {value: 'Naiset'}, {value: '1'}, {value: 'Test5'}],
  [{value: '2'}, {value: 'Naiset'}, {value: '1'}, {value: 'Test6'}],
  [{value: '2'}, {value: 'Naiset'}, {value: 'xxxxx'}, {value: 'Test7'}],
  [{value: '2'}, {value: 'Naiset'}, {value: '-1'}, {value: 'Test8'}],
  [{value: '3'}, {value: 'Naiset'}, {value: '1'}, {value: 'Test9'}],
  [{value: '3'}, {value: 'Naiset'}, {value: '1'}, {value: 'Test10'}],
  [{value: '3'}, {value: 'Naiset'}, {value: '-1'}, {value: 'Test11'}],
  [{value: '3'}, {value: 'Naiset'}, {value: '-1'}, {value: 'Test12'}],
];

const testScoresHeaders = ['Lohko','Sarja', 'Pisteet', 'Nimi', '']

let tableRowClicked = false;

const mockTableRowClick = (row) => {
  tableRowClicked = true;
};

const TestTableWithPaginator = (props) => {
  const tableControl = useTable({rowsPerPage: 4, type: props.type});

  useEffect(() => {
    switch (props.type) {
      case 'logs':
        tableControl.setHeaders(testLogHeaders) 
        tableControl.initializeRows(testLogRows)
        break;
      case 'scores':
        tableControl.setHeaders(testScoresHeaders) 
        tableControl.initializeRows(testInvalidScoreRows)
        break;
    } 
  }, []);

  return (
    <TableWithPaginator control={tableControl} rowClick={mockTableRowClick}/>
  );
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TestTableWithPaginator />, div);
});

it('show logs', () => {
  render(<TestTableWithPaginator type='logs'/>)
  testLogHeaders.forEach(text => {
    expect(screen.getByText(text)).toBeInTheDocument()
  });

  expect(screen.getByText(testLogRows[0][0].value)).toBeInTheDocument();
  expect(screen.getByText(testLogRows[0][1].value)).toBeInTheDocument();
});

it('show scores', () => {
  render(<TestTableWithPaginator type='scores'/>);
  for (let i = 0; i > 4; i++) {
    expect(screen.getByText(testScoresHeaders[i])).toBeInTheDocument();
  }

  for (let i = 0; i > 4; i++) {
    expect(screen.getByText(testInvalidScoreRows[i][0].value)).toBeInTheDocument();
    expect(screen.getByText(testInvalidScoreRows[i][1].value)).toBeInTheDocument();
    expect(screen.getByText(testInvalidScoreRows[i][2].value)).toBeInTheDocument();
    expect(screen.getByText(testInvalidScoreRows[i][3].value)).toBeInTheDocument();
  }
});

it('paginator click', () => {
  render(<TestTableWithPaginator type='logs'/>)
  for (let i = 0; i < 4; i++) {
    expect(screen.getByText(testLogRows[i][0].value)).toBeInTheDocument();
    expect(screen.getByText(testLogRows[i][1].value)).toBeInTheDocument();
  }

  for (let i = 4; i < 8; i++) {
    expect(screen.queryByText(testLogRows[i][0].value)).toBeNull();
    expect(screen.queryByText(testLogRows[i][1].value)).toBeNull();
  }

  fireEvent.click(screen.getByAltText('next arrow'))


  for (let i = 4; i < 8; i++) {
    expect(screen.getByText(testLogRows[i][0].value)).toBeInTheDocument();
    expect(screen.getByText(testLogRows[i][1].value)).toBeInTheDocument();
  }

  for (let i = 0; i < 4; i++) {
    expect(screen.queryByText(testLogRows[i][0].value)).toBeNull();
    expect(screen.queryByText(testLogRows[i][1].value)).toBeNull();
  }

  fireEvent.click(screen.getByAltText('back arrow'))

  for (let i = 0; i < 4; i++) {
    expect(screen.getByText(testLogRows[i][0].value)).toBeInTheDocument();
    expect(screen.getByText(testLogRows[i][1].value)).toBeInTheDocument();
  }

  for (let i = 4; i < 8; i++) {
    expect(screen.queryByText(testLogRows[i][0].value)).toBeNull();
    expect(screen.queryByText(testLogRows[i][1].value)).toBeNull();
  }

});

it('table row click', () => {
  tableRowClicked = false;
  render(<TestTableWithPaginator type='logs'/>);

  fireEvent.click(screen.queryByText(testLogRows[0][1].value));
  expect(tableRowClicked).toBe(true);
});

it('show error message', () => {
  render(<TestTableWithPaginator type='scores'/>);
  const errorMessage1 = 'Lohkon pisteet laskettu väärin: -18';
  expect(screen.getByText(errorMessage1)).toBeInTheDocument();

  fireEvent.click(screen.getByAltText('next arrow'));
  const errorMessage2 = 'Lohkossa virheellisiä pisteitä!';
  expect(screen.getByText(errorMessage2)).toBeInTheDocument();

  fireEvent.click(screen.getByAltText('next arrow'));

  expect(screen.queryByText(errorMessage1)).toBeNull();
  expect(screen.queryByText(errorMessage2)).toBeNull();
});