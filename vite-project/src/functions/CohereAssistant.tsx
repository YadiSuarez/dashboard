import { useState, useRef } from "react";

interface CohereAssistantOutput {
  response: string | null;
  loading: boolean;
  error: string | null;
  sendWeatherQuery: (prompt: string, params: { temperatura: number; viento: number; humedad: number }) => Promise<void>;
  callsLeft: number;
}

const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;
const MAX_CALLS = 10; // Límite de llamadas por sesión
const COHERE_API_URL = "https://api.cohere.ai/v1/chat";

export default function useCohereAssistant(): CohereAssistantOutput {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const callsRef = useRef<number>(MAX_CALLS);

  // Envia el prompt del usuario junto con los parámetros del clima
  const sendWeatherQuery = async (
    prompt: string,
    params: { temperatura: number; viento: number; humedad: number }
  ) => {
    if (callsRef.current <= 0) {
      setError("Límite de consultas alcanzado.");
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);

    // Construye el mensaje para Cohere
    const fullPrompt = `${prompt}\n\nDatos del clima actual: temperatura ${params.temperatura}°C, viento ${params.viento} km/h, humedad ${params.humedad}%.`;

    try {
      const res = await fetch(COHERE_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "command-xlarge-nightly",
          message: fullPrompt
        }),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data.text || data.reply || "Sin respuesta.");
      callsRef.current -= 1;
    } catch (err: any) {
      setError(err.message || "Error desconocido al consultar Cohere.");
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, error, sendWeatherQuery, callsLeft: callsRef.current };
}