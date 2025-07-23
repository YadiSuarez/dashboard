import { useState } from "react";
import useCohereAssistant from "../functions/CohereAssistant";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import type { OpenMeteoResponse } from "../types/DashboardTypes";

interface CohereRecommendationsProps {
  weather: OpenMeteoResponse;
  city: string;
}

export default function CohereRecommendations(data: CohereRecommendationsProps) {
  const [prompt, setPrompt] = useState("");
  const [requestedPrompt, setRequestedPrompt] = useState<string | null>(null);

  const userPrompt = requestedPrompt ?? "";
  const { response, loading, error, callsLeft } = useCohereAssistant(data.weather, userPrompt, data.city[0]);

  const handleClick = () => {
    const finalPrompt =
      prompt.trim() ||
      "Dame 4 recomendaciones o acotaciones muy breves según el clima, y clasifica cada una con una severidad entre: success, info, warning o error. Usa este formato:\n\n[SEVERITY] Recomendación. No uses asteriscos ni comillas.\n\nEjemplo:\n\n[success] Lleva paraguas si sales.\n[info] Hoy es un buen día para hacer ejercicio al aire libre.\n[warning] Evita salir si no es necesario, el viento está fuerte.\n[error] No salgas sin abrigo, la temperatura es muy baja.";
    setRequestedPrompt(finalPrompt);
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

        {requestedPrompt && (
          <>
            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
              <strong>Tu pregunta:</strong> {requestedPrompt}
            </Typography>
            {response && (
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {response}
                </Typography>
              </Alert>
            )}
          </>
        )}

        {!requestedPrompt && (
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
