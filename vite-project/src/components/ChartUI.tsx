import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DataFetcher from '../functions/DataFetcher';


interface ChartUIProps {
  city: string;
}

export default function ChartUI({ city }: ChartUIProps) {
  
  const { data, loading, error } = DataFetcher(city);

  let labels: string[] = [];
  let temperatureData: number[] = [];
  let windData: number[] = [];

  if (data && data.hourly) {
    const times = data.hourly.time.slice(0, 24);
    labels = times.map((t: string) => t.split('T')[1]);
    temperatureData = data.hourly.temperature_2m.slice(0, 24);
    windData = data.hourly.wind_speed_10m.slice(0, 24);
  }

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Typography variant="h5" component="div" gutterBottom>
        Temperatura y Velocidad del Viento (últimas 24h)
      </Typography>
      <LineChart
        height={300}
        series={[
          { data: temperatureData, label: 'Temperatura (°C)' },
          { data: windData, label: 'Viento (km/h)' },
        ]}
        xAxis={[{ scaleType: 'point', data: labels }]}
        sx={{
          backgroundColor: '#f1f4f8'}}
      />
    </>
  );
}
