import HeaderUI from './components/headerUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectUI';
import { useState, useEffect } from 'react';
import {Grid} from '@mui/material';
import IndicatorUI from './components/IndicatorUI';
import DataFetcher from './functions/DataFetcher';
import './App.css';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';


function App() {
  // Estado para la ciudad seleccionada
  const [city, setCity] = useState('guayaquil');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coordenadas por ciudad
  const cityCoords: Record<string, { lat: number; lon: number }> = {
    guayaquil: { lat: -2.19616, lon: -79.88621 },
    quito: { lat: -0.22985, lon: -78.52495 },
    manta: { lat: -0.94937, lon: -80.73137 },
    cuenca: { lat: -2.90055, lon: -79.00453 },
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setWeather(null);
      setLoading(true);
      setError(null);
      try {
        const coords = cityCoords[city] || cityCoords['guayaquil'];
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener los datos del clima.');
        const data = await response.json();
        setWeather(data);
      } catch (err: any) {
        setError(err.message || 'Error inesperado.');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">

         {/* Encabezado */}
         <Grid size={{ xs: 12, md: 12 }}>
          <HeaderUI/>
         </Grid>

         {/* Alertas */}
         <Grid size={{ xs: 12, md: 12 }} container justifyContent="right" alignItems="center">
          <AlertUI description='No se preveen lluvias'/>
         </Grid>

         {/* Selector */}
         <Grid size={{ xs: 12, md: 3 }}>
          <SelectorUI city={city} setCity={setCity} />
         </Grid>

         {/* Indicadores */}
         <Grid container size={{ xs: 12, md: 9 }} >
           {loading && <p>Cargando datos...</p>}
           {error && <p>Error: {error}</p>}
           {weather && weather.current && weather.current_units && (
             <>
               <Grid size={{ xs: 12, md: 3 }} >
                 <IndicatorUI
                   title='Temperatura (2m)'
                   description={weather.current.temperature_2m + ' ' + weather.current_units.temperature_2m} />
               </Grid>
               <Grid size={{ xs: 12, md: 3 }}>
                 <IndicatorUI
                   title='Temperatura aparente'
                   description={weather.current.apparent_temperature + ' ' + weather.current_units.apparent_temperature} />
               </Grid>
               <Grid size={{ xs: 12, md: 3 }}>
                 <IndicatorUI
                   title='Velocidad del viento'
                   description={weather.current.wind_speed_10m + ' ' + weather.current_units.wind_speed_10m} />
               </Grid>
               <Grid size={{ xs: 12, md: 3 }}>
                 <IndicatorUI
                   title='Humedad relativa'
                   description={weather.current.relative_humidity_2m + ' ' + weather.current_units.relative_humidity_2m} />
               </Grid>
             </>
           )}
         </Grid>

         {/* Gráfico */}
           <Grid size={{ xs: 6, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
              <ChartUI city={city} />
           </Grid>

           {/* Tabla */}
           <Grid size={{ xs: 6, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
              <TableUI city={city} />
           </Grid>

         {/* Información adicional */}
         <Grid size={{ xs: 12, md: 12 }}>Elemento: Información adicional</Grid>    
          

      </Grid>
  )
}

export default App
