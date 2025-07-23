import { useState, useRef, useEffect } from "react";
import type { OpenMeteoResponse } from "../types/DashboardTypes";

interface CohereAssistantOutput {
  response: string | null;
  loading: boolean;
  error: string | null;
  callsLeft: number;
}
const CACHE_DURATION_MINUTES = 10;

function getCacheKey(city: string) {
  return `cohere_weather_${city}`;
}

const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;
const MAX_CALLS = 10; // Límite de llamadas por sesión
const COHERE_API_URL = "https://api.cohere.ai/v1/chat";



export default function useCohereAssistant(data: OpenMeteoResponse, prompt: string, city: string): CohereAssistantOutput {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const callsRef = useRef<number>(MAX_CALLS);


  useEffect(() => {
    if (!data) return;
    if (callsRef.current <= 0) {
      setError("Límite de consultas alcanzado.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);
    const cacheKey = getCacheKey(city);
    const cached = localStorage.getItem(cacheKey);
    let cachedData: { timestamp: number; data: string} | null = null;
    
    if (cached) {
        try {
            cachedData = JSON.parse(cached);
        } catch {
            cachedData = null;
        }
    }
    
      const now = Date.now();
      const isCacheValid = cachedData && now - cachedData.timestamp < CACHE_DURATION_MINUTES * 60 * 1000;
    
      if (isCacheValid) {
          setResponse(cachedData!.data);
          setLoading(false);
          return;
      }

    const fullPrompt = `${prompt}\n\nDatos del clima actual: temperatura ${data.current.temperature_2m}°C, viento ${data.current.wind_speed_10m} km/h, humedad ${data.current.relative_humidity_2m}%.`;
   

    const fetchData = async () => {
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
        const resultText = data.text || data.reply || "Sin respuesta.";


        setResponse(resultText);
        callsRef.current -= 1;
        localStorage.setItem(
            cacheKey,
            JSON.stringify({ timestamp: now, data: resultText })
        );
      } catch (err: any) {
         if (cachedData) {
            // Resiliencia: usar datos viejos si hay error en la API
            setResponse(cachedData.data);
            setError("No se pudo actualizar la información. Mostrando datos almacenados temporalmente.");
        } else if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Ocurrió un error desconocido al obtener los datos.");
        }
      } finally {
          setLoading(false);
      }
    };

    fetchData();
  }, [data]);

  return { response, loading, error, callsLeft: callsRef.current };
}