import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DataFetcher from '../functions/DataFetcher';

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 70, },
   {
      field: 'hour',
      headerName: 'Hora',
      width: 90,
   },
   {
      field: 'temperature',
      headerName: 'Temperatura (°C)',
      width: 140,
   },
   {
      field: 'wind',
      headerName: 'Viento (km/h)',
      width: 120,
   },
   {
      field: 'resumen',
      headerName: 'Resumen',
      description: 'No es posible ordenar u ocultar esta columna.',
      sortable: false,
      hideable: false,
      width: 220,
      valueGetter: (_, row) => {
         // row.time is the full ISO string, e.g. '2025-07-09T14:00'
         // If not present, fallback to hour only
         if (row.time) {
            const [date, hour] = row.time.split('T');
            return `${date} ${hour}, Temp: ${row.temperature}°C, Viento: ${row.wind} km/h`;
         }
         return `${row.hour}, Temp: ${row.temperature}°C, Viento: ${row.wind} km/h`;
      },
   },
];



interface TableUIProps {
  city: string;
}


export default function TableUI({ city }: TableUIProps) {

  const { data, loading, error } = DataFetcher(city);

  let rows: any[] = [];
  if (data && data.hourly) {
    const times: string[] = data.hourly.time.slice(0, 24);
    const temps: number[] = data.hourly.temperature_2m.slice(0, 24);
    const winds: number[] = data.hourly.wind_speed_10m.slice(0, 24);
    rows = times.map((t, i) => ({
      id: i,
      time: t,
      hour: t.split('T')[1],
      temperature: temps[i],
      wind: winds[i],
    }));
  }

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[3]}
        disableRowSelectionOnClick
      
      />
    </Box>
  );
}