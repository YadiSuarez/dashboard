import Typography from "@mui/material/Typography";
export default function HeaderUI(){
    return (
        <>
        <Typography
            variant="h2"
            component="h1"
            sx={{fontWeight: 'bold'}}>
                Dashboard Climatico
        </Typography>
        <Typography
            fontFamily={"Roboto"}
            fontSize={20}>
                Monitoreo en tiempo real en ciudades de Ecuador
        </Typography>
        </>
    )
}
