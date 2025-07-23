import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
interface SelectorUIProps {
  city: string;
  setCity: (city: string) => void;
}

export default function SelectorUI({ city, setCity }: SelectorUIProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    setCity(event.target.value);
  };

  return (
<FormControl
  fullWidth
  variant="outlined"
  sx={{
    mt: 3,
    position: 'relative',
  }}
>
  <InputLabel
    id="city-select-label"
    sx={{
      color: '#f1f4f8',
      fontWeight: 'bold',
      fontSize: '1.5rem',
      backgroundColor: '#142f66',
      px: 0.5,
      mt: -0.7, // ¡Subimos el label!
      ml: 1.5,
      zIndex: 1,
      pointerEvents: 'none',
      '&.Mui-focused': {
        color: '#ffffff',
      },
    }}
  >
    Ciudad
  </InputLabel>
  <Select
    labelId="city-select-label"
    id="city-simple-select"
    value={city}
    onChange={handleChange}
    label="Ciudad"
    sx={{
      backgroundColor: '#142f66',
      borderRadius: 2,
      color: '#f5f6f8',
      fontWeight: 'bold',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1d4ed8',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#90cdf4',
      },
      '& svg': {
        color: '#f5f6f8',
      },
    }}
  >
    <MenuItem value="guayaquil">Guayaquil</MenuItem>
    <MenuItem value="quito">Quito</MenuItem>
    <MenuItem value="manta">Manta</MenuItem>
    <MenuItem value="cuenca">Cuenca</MenuItem>
  </Select>
  {city && (
    <p style={{ marginTop: '0.5em', color: '#333' }}>
      Información del clima en{' '}
      <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{city}</span>
    </p>
  )}
</FormControl>

  );
}

