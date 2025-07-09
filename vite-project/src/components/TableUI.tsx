
import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 90 },
   {
      field: 'hour',
      headerName: 'Hora',
      width: 120,
   },
   {
      field: 'temperature',
      headerName: 'Temperatura (°C)',
      width: 160,
   },
   {
      field: 'wind',
      headerName: 'Viento (km/h)',
      width: 150,
   },
   {
      field: 'resumen',
      headerName: 'Resumen',
      description: 'No es posible ordenar u ocultar esta columna.',
      sortable: false,
      hideable: false,
      width: 200,
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

const cityCoords: Record<string, { lat: number; lon: number }> = {
  guayaquil: { lat: -2.1962, lon: -79.8862 },
  quito: { lat: -0.1807, lon: -78.4678 },
  manta: { lat: -0.9677, lon: -80.7089 },
  cuenca: { lat: -2.9006, lon: -79.0045 },
};

export default function TableUI({ city }: TableUIProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const coords = cityCoords[city] || cityCoords['guayaquil'];
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,wind_speed_10m&timezone=America%2FChicago`
        );
        if (!response.ok) {
          throw new Error('Error al obtener los datos del clima.');
        }
        const data = await response.json();
        const times: string[] = data.hourly.time.slice(0, 24);
        const temps: number[] = data.hourly.temperature_2m.slice(0, 24);
        const winds: number[] = data.hourly.wind_speed_10m.slice(0, 24);
        const tableRows = times.map((t, i) => ({
          id: i,
          time: t, // full ISO string
          hour: t.split('T')[1],
          temperature: temps[i],
          wind: winds[i],
        }));
        setRows(tableRows);
      } catch (err: any) {
        setError(err.message || 'Error inesperado.');
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, [city]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ height: 350, width: '100%' }}>
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
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}