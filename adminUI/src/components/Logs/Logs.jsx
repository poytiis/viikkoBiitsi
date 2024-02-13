import {useEffect, useState} from 'react';
import './Logs.scss';
import Layout from '../Layout/Layout';
import {fetchLogsFetch} from '../../services/httpClient';
import SnackBar from '../SnackBar/SnackBar';
import TableWithPaginator from '../TableWithPaginator/TableWithPaginator';
import useTable from '../../hooks/useTable';

const Logs = () => {
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const tableControl = useTable({rowsPerPage: 6, type: 'logs'});

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetchLogsFetch();
        if (!res.ok) setSnackBarMessage('Lokien hakeminen epäonnistui');
        else {
          const json = await res.json();
          const logsData = json.data;
          const logsDataTable = logsData.map(row => {
            const timeStamp = {value: row.aikaleima};
            const log = {value: row.merkinta};
            return [timeStamp, log];
          });

          tableControl.setHeaders(['Lokiaika', 'Merkintä']);
          tableControl.initializeRows(logsDataTable.reverse());
        }
      } catch (ex) {
        setSnackBarMessage('Lokien hakeminen epäonnistui');
      }
    }
    fetchLogs();
  }, []);

  return (
    <Layout>
      <div className='logs flex-column-center'>
        <h2 className='logs__header'>Järjestelmän lokimerkinnät</h2>

        <TableWithPaginator
          control={tableControl}
          rowClick={() => {}}
        />
      </div>

      { snackBarMessage !== '' &&
        <SnackBar close={() => {setSnackBarMessage('')}}>{snackBarMessage}</SnackBar>
      }

    </Layout>
  );
};

export default Logs;
