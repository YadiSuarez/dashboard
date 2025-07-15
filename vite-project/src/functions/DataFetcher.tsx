import { useEffect, useState } from "react";
import type { OpenMeteoResponse } from "../types/DashboardTypes";

interface DataFetcherOutput {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}
const cityCoords: Record<string, { lat: number; lon: number }> = {
    guayaquil: { lat: -2.19616, lon: -79.88621 },
    quito: { lat: -0.22985, lon: -78.52495 },
    manta: { lat: -0.94937, lon: -80.73137 },
    cuenca: { lat: -2.90055, lon: -79.00453 },
};

const CACHE_DURATION_MINUTES = 10;

function getCacheKey(city: string) {
    return `weather_${city}`;
}

export default function DataFetcher(city: string): DataFetcherOutput {
    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setData(null);

        const coords = cityCoords[city];
        if (!coords) {
            setError("Ciudad no válida.");
            setLoading(false);
            return;
        }

        const cacheKey = getCacheKey(city);
        const cached = localStorage.getItem(cacheKey);
        let cachedData: { timestamp: number; data: OpenMeteoResponse } | null = null;

        if (cached) {
            try {
                cachedData = JSON.parse(cached);
            } catch {
                cachedData = null;
            }
        }

        const now = Date.now();
        const isCacheValid =
            cachedData && now - cachedData.timestamp < CACHE_DURATION_MINUTES * 60 * 1000;

        if (isCacheValid) {
            setData(cachedData!.data);
            setLoading(false);
            return;
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago`;

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }
                const result: OpenMeteoResponse = await response.json();
                setData(result);
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({ timestamp: now, data: result })
                );
            } catch (err: any) {
                if (cachedData) {
                    // Resiliencia: usar datos viejos si hay error en la API
                    setData(cachedData.data);
                    setError(
                        "No se pudo actualizar la información. Mostrando datos almacenados temporalmente."
                    );
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
    }, [city]);

    return { data, loading, error };
}