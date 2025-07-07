import HeaderUI from './components/headerUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectUI';
import {Grid} from '@mui/material';
import IndicatorUI from './components/IndicatorUI';
import DataFetcher from './functions/DataFetcher';
import './App.css';

function App() {
  const dataFetcherOutput = DataFetcher();
  
  console.log("Data Fetcher Output:", dataFetcherOutput);
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
          <SelectorUI/>
         </Grid>

         {/* Indicadores */}
         <Grid container size={{ xs: 12, md: 9 }} >

                 {/* Renderizado condicional de los datos obtenidos */}

                 {dataFetcherOutput.loading && <p>Cargando datos...</p>}
                 {dataFetcherOutput.error && <p>Error: {dataFetcherOutput.error}</p>}
                 {dataFetcherOutput.data && (
                 <>

                     {/* Indicadores con datos obtenidos */}

                     <Grid size={{ xs: 12, md: 3 }} >
                         <IndicatorUI
                             title='Temperatura (2m)'
                             description={dataFetcherOutput.data.current.temperature_2m + " " + dataFetcherOutput.data.current_units.temperature_2m} />
                     </Grid>

                     <Grid size={{ xs: 12, md: 3 }}>
                         <IndicatorUI
                             title='Temperatura aparente'
                             description={dataFetcherOutput.data.current.apparent_temperature + " " + dataFetcherOutput.data.current_units.apparent_temperature} />
                     </Grid>

                     <Grid size={{ xs: 12, md: 3 }}>
                         <IndicatorUI
                             title='Velocidad del viento'
                             description={dataFetcherOutput.data.current.wind_speed_10m + " " + dataFetcherOutput.data.current_units.wind_speed_10m} />
                     </Grid>

                     <Grid size={{ xs: 12, md: 3 }}>
                         <IndicatorUI
                             title='Humedad relativa'
                             description={dataFetcherOutput.data.current.relative_humidity_2m + " " + dataFetcherOutput.data.current_units.relative_humidity_2m} />
                     </Grid>

                 </>
                 )}

             </Grid>

         {/* Gráfico */}
         <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "block"} }} >Elemento: Gráfico</Grid>

         {/* Tabla */}
         <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "block"} }} >Elemento: Tabla</Grid>

         {/* Información adicional */}
         <Grid size={{ xs: 12, md: 12 }}>Elemento: Información adicional</Grid>

      </Grid>
  )
}

export default App
