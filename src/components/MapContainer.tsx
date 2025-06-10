
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { geographyData } from "@/data/geographyData";

interface MapContainerProps {
  mapboxToken: string;
}

export const MapContainer = ({ mapboxToken }: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"oceans" | "countries" | "mountains">("oceans");

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      zoom: 2,
      center: [0, 20],
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    const markers = document.querySelectorAll('.mapbox-marker');
    markers.forEach(marker => marker.remove());

    // Add markers for selected category
    const data = geographyData[selectedCategory];
    data.forEach((item) => {
      if (item.coordinates) {
        const el = document.createElement('div');
        el.className = 'mapbox-marker';
        el.style.backgroundColor = selectedCategory === 'oceans' ? '#3b82f6' : 
                                 selectedCategory === 'countries' ? '#10b981' : '#f59e0b';
        el.style.width = '12px';
        el.style.height = '12px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.cursor = 'pointer';

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="font-semibold">${item.name}</div>
           ${item.description ? `<div class="text-sm text-gray-600">${item.description}</div>` : ''}`
        );

        new mapboxgl.Marker(el)
          .setLngLat(item.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      }
    });
  }, [selectedCategory]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedCategory === "oceans" ? "default" : "outline"}
            onClick={() => setSelectedCategory("oceans")}
            className="text-sm"
          >
            Ozeane & Meere
          </Button>
          <Button
            variant={selectedCategory === "countries" ? "default" : "outline"}
            onClick={() => setSelectedCategory("countries")}
            className="text-sm"
          >
            Länder & Kontinente
          </Button>
          <Button
            variant={selectedCategory === "mountains" ? "default" : "outline"}
            onClick={() => setSelectedCategory("mountains")}
            className="text-sm"
          >
            Gebirge & Berge
          </Button>
        </div>
        
        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg border border-border overflow-hidden"
        />
        
        <p className="text-sm text-muted-foreground mt-2">
          Klicke auf die Punkte auf der Karte, um mehr Informationen zu erhalten.
        </p>
      </Card>
    </div>
  );
};
