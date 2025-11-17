import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function MapBounds({ cities }) {
  const map = useMap();

  useEffect(() => {
    if (cities.length === 0) return;

    // Cria os limites do mapa com todas as cidades
    const bounds = L.latLngBounds(cities.map(city => [city.lat, city.lng]));

    // Ajusta o mapa para caber todas as cidades
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [cities, map]);

  return null; // não renderiza nada
}
