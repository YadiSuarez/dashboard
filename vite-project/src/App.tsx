import HeaderUI from './components/headerUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectUI';
import { useState } from 'react';
import {Grid} from '@mui/material';
import IndicatorUI from './components/IndicatorUI';
import DataFetcher from './functions/DataFetcher';
import './App.css';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';


function App() {
  // Estado para la ciudad seleccionada
  const [city, setCity] = useState('guayaquil');

  // Usa el hook personalizado para obtener los datos
  const { data: weather, loading, error } = DataFetcher(city);


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
