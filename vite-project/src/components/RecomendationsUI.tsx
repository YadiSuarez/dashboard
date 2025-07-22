import { useState } from "react";
import useCohereAssistant from "../functions/CohereAssistant";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

interface CohereRecommendationsProps {
  temperatura: number;
  viento: number;
  humedad: number;
}

export default function CohereRecommendations({ temperatura, viento, humedad }: CohereRecommendationsProps) {
  const { response, loading, error, sendWeatherQuery, callsLeft } = useCohereAssistant();
  const [requested, setRequested] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleClick = () => {
    // Si el usuario no escribe nada, se usa un prompt por defecto
    const userPrompt = prompt.trim() || "¿Qué recomendaciones hay para este clima?";
    sendWeatherQuery(userPrompt, { temperatura, viento, humedad });
    setRequested(true);
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Pregunta tus dudas aquí
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Escribe tu pregunta sobre el clima o deja el campo vacío para recibir recomendaciones generales.
        </Typography>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Ejemplo: Dame una recomendación para hoy"
          style={{ width: "100%", marginBottom: 12, padding: 8, fontSize: 16 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          disabled={loading || callsLeft <= 0}
          sx={{ mb: 2 }}
        >
          Obtener respuesta
        </Button>
        {loading && <CircularProgress />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {response && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {response}
            </Typography>
          </Alert>
        )}
        {!requested && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Presiona el botón para recibir sugerencias personalizadas según el clima.
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
         Consultas restantes: {callsLeft}
        </Typography>
      </CardContent>
    </Card>
  );
}