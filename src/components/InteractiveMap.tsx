
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { geographyData } from "@/data/geographyData";

// Fix for default markers in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface InteractiveMapProps {
  selectedCategory?: "oceans" | "countries" | "mountains";
  onMapClick?: (item: any) => void;
  highlightTarget?: any;
  disabled?: boolean;
}

export const InteractiveMap = ({ 
  selectedCategory = "oceans", 
  onMapClick,
  highlightTarget,
  disabled = false 
}: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mapCategory, setMapCategory] = useState<"oceans" | "countries" | "mountains">(selectedCategory);

  const categoryColors = {
    oceans: "#3b82f6", // blue
    countries: "#10b981", // green
    mountains: "#f59e0b" // orange
  };

  const categoryTitles = {
    oceans: "Ozeane & Meere",
    countries: "Länder & Kontinente",
    mountains: "Gebirge & Berge"
  };

  // Create custom icons for different categories
  const createCustomIcon = (color: string, isTarget = false) => {
    const size = isTarget ? 25 : 20;
    const border = isTarget ? '4px solid #ffffff' : '3px solid white';
    const animation = isTarget ? 'animation: pulse 2s infinite;' : '';
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${border}; box-shadow: 0 2px 6px rgba(0,0,0,0.4); ${animation}"></div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current) return;

    try {
      // Initialize map
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true
      }).setView([20, 0], 2);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 10,
        minZoom: 1
      }).addTo(mapInstance.current);

      // Force map to resize after a short delay
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    initializeMap();

    // Add global styles for tooltips and animations
    const style = document.createElement('style');
    style.textContent = `
      .custom-tooltip {
        background-color: rgba(0, 0, 0, 0.8) !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        padding: 4px 8px !important;
        font-size: 12px !important;
      }
      .custom-tooltip::before {
        border-top-color: rgba(0, 0, 0, 0.8) !important;
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      // Clean up style
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Force map refresh when disabled state changes
  useEffect(() => {
    if (mapInstance.current) {
      setTimeout(() => {
        mapInstance.current?.invalidateSize();
      }, 100);
    }
  }, [disabled]);

  useEffect(() => {
    setMapCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstance.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers for current category
    const currentData = geographyData[mapCategory];
    
    currentData.forEach((item) => {
      if (!item.coordinates) return;

      const isTarget = highlightTarget && item.name === highlightTarget.name;
      const icon = createCustomIcon(categoryColors[mapCategory], isTarget);

      const marker = L.marker([item.coordinates[1], item.coordinates[0]], { icon })
        .addTo(mapInstance.current!)
        .on('click', () => {
          if (onMapClick && !disabled) {
            onMapClick(item);
          } else {
            setSelectedItem(item);
          }
        });

      // Add tooltip only if not in challenge mode
      if (!onMapClick) {
        marker.bindTooltip(item.name, {
          permanent: false,
          direction: 'top',
          className: 'custom-tooltip'
        });
      }

      markersRef.current.push(marker);
    });

    // Force map refresh after adding markers
    setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    }, 50);
  }, [mapCategory, highlightTarget, onMapClick, disabled]);

  const handleCategoryChange = (category: "oceans" | "countries" | "mountains") => {
    setMapCategory(category);
    setSelectedItem(null);
  };

  // If used in challenge mode, don't show category buttons or selected item
  if (onMapClick) {
    return (
      <Card className="p-4">
        <div className="relative rounded-lg overflow-hidden border">
          <div 
            ref={mapRef} 
            className={`h-96 w-full ${disabled ? 'pointer-events-none opacity-75' : 'cursor-crosshair'}`}
            style={{ height: '400px', minHeight: '400px' }}
          />
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          {disabled ? "Warte auf die nächste Frage..." : "Klicke auf den gesuchten Ort auf der Karte!"}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(categoryTitles).map(([key, title]) => (
            <Button
              key={key}
              variant={mapCategory === key ? "default" : "outline"}
              onClick={() => handleCategoryChange(key as any)}
              className="text-sm"
            >
              {title}
            </Button>
          ))}
        </div>
        
        <div className="relative rounded-lg overflow-hidden border">
          <div 
            ref={mapRef} 
            className="h-96 w-full"
            style={{ height: '400px', minHeight: '400px' }}
          />
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          Klicke auf die farbigen Punkte auf der Karte, um mehr Informationen zu erhalten.
        </p>
      </Card>

      {selectedItem && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
              <Badge 
                className="text-white"
                style={{ backgroundColor: categoryColors[mapCategory] }}
              >
                {selectedItem.code || "Info"}
              </Badge>
            </div>
            {selectedItem.description && (
              <p className="text-muted-foreground">{selectedItem.description}</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
