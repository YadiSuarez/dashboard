import { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface WeatherData {
   hourly: {
      time: string[];
      temperature_2m: number[];
      wind_speed_10m: number[];
   };
}

interface ChartUIProps {
  city: string;
}

const cityCoords: Record<string, { lat: number; lon: number }> = {
  guayaquil: { lat: -2.1962, lon: -79.8862 },
  quito: { lat: -0.1807, lon: -78.4678 },
  manta: { lat: -0.9677, lon: -80.7089 },
  cuenca: { lat: -2.9006, lon: -79.0045 },
};

export default function ChartUI({ city }: ChartUIProps) {
  const [labels, setLabels] = useState<string[]>([]);
  const [temperatureData, setTemperatureData] = useState<number[]>([]);
  const [windData, setWindData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
        const data: WeatherData = await response.json();
        const times = data.hourly.time.slice(0, 24); // Primeras 24 horas
        const temps = data.hourly.temperature_2m.slice(0, 24);
        const winds = data.hourly.wind_speed_10m.slice(0, 24);
        setLabels(times.map((t) => t.split('T')[1])); // solo hora HH:MM
        setTemperatureData(temps);
        setWindData(winds);
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
      />
    </>
  );
}
