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
    <FormControl fullWidth>
      <InputLabel id="city-select-label">Ciudad</InputLabel>
      <Select
        labelId="city-select-label"
        id="city-simple-select"
        label="Ciudad"
        onChange={handleChange}
        value={city}
      >
        <MenuItem value={"guayaquil"}>Guayaquil</MenuItem>
        <MenuItem value={"quito"}>Quito</MenuItem>
        <MenuItem value={"manta"}>Manta</MenuItem>
        <MenuItem value={"cuenca"}>Cuenca</MenuItem>
      </Select>
      {city && (
        <p>
          Información del clima en{' '}
          <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{city}</span>
        </p>
      )}
    </FormControl>
  );
}

