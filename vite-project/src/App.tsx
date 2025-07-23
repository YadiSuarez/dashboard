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
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import ThermostatAutoIcon from '@mui/icons-material/ThermostatAuto';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import useCohereAssistant from './functions/CohereAssistant';

function App() {
  // Estado para la ciudad seleccionada
  const [city, setCity] = useState('guayaquil');

  // Usa el hook personalizado para obtener los datos
  const { data: weather, loading, error } = DataFetcher(city);

  // Hook para las recomendaciones de Cohere

  const {
  response,
} = useCohereAssistant(weather!, "Dame 4 recomendaciones o acotaciones muy breves según el clima, y clasifica cada una con una severidad entre: success, info, warning o error. Usa este formato:\n\n[SEVERITY] Recomendación. No uses asteriscos ni comillas.\n\nEjemplo:\n\n[success] Lleva paraguas si sales.\n[info] Hoy es un buen día para hacer ejercicio al aire libre.\n[warning] Evita salir si no es necesario, el viento está fuerte.\n[error] No salgas sin abrigo, la temperatura es muy baja.", city);




console.log("Respuesta de Cohere:", response);
  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center" sx={{padding: '20px'}}>

         {/* Encabezado */}
         <Grid size={{ xs: 12, md: 12 }}  id="encabezado">
          <HeaderUI/>
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
                   description={weather.current.temperature_2m + ' ' + weather.current_units.temperature_2m}
                   icon={<DeviceThermostatIcon sx={{color: "red"}}/>}
                   background='#fceded' />
               </Grid>
               <Grid size={{ xs: 12, md: 3 }}>
                 <IndicatorUI
                   title='Temperatura aparente'
                   description={weather.current.apparent_temperature + ' ' + weather.current_units.apparent_temperature} 
                   icon={<ThermostatAutoIcon sx={{color: "red"}} />}
                   background='#fceded'/>
                  
               </Grid>
               <Grid size={{ xs: 12, md: 3 }}>
                 <IndicatorUI
                   title='Velocidad del viento'
                   description={weather.current.wind_speed_10m + ' ' + weather.current_units.wind_speed_10m}
                   icon={<AirIcon sx={{color: "blue"}}/>} 
                   background='#ecebfc'/>
               </Grid>
               <Grid size={{ xs: 12, md: 3 }}>
                 <IndicatorUI
                   title='Humedad relativa'
                   description={weather.current.relative_humidity_2m + ' ' + weather.current_units.relative_humidity_2m} 
                   icon= {<WaterDropIcon sx={{color: "blue"}}/>}
                   background='#ecebfc'/>
               </Grid>
             </>
           )}
         </Grid>

         {/* Alertas */}
         <Grid size={{ xs: 12, md: 12 }} container justifyContent="right" alignItems="center">
            {response?.split('\n').map((line, index) => {
  // Regex para líneas que comienzan con [severity] seguido de texto
  const match = line.match(/^\s*\[(success|info|warning|error)\]\s+(.+)$/i);
  if (!match) return null;
  const [, severity, text] = match;
        return (
          <Grid size={{xs:12, md:3}} key={index}>
            <AlertUI description={text} severity={severity.toLowerCase() as any} />
          </Grid>
        );
      })}
         </Grid>

         {/* Gráfico */}
           <Grid size={{ xs: 6, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
              <ChartUI city={city} />
           </Grid>

           {/* Tabla */}
           <Grid size={{ xs: 6, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
              <TableUI city={city} />
           </Grid>

         

      </Grid>
  )
}

export default App
