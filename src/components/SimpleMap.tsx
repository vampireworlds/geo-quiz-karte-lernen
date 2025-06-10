
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { geographyData } from "@/data/geographyData";

interface SimpleMapProps {
  selectedCategory?: "oceans" | "countries" | "mountains";
}

export const SimpleMap = ({ selectedCategory = "oceans" }: SimpleMapProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mapCategory, setMapCategory] = useState<"oceans" | "countries" | "mountains">(selectedCategory);

  const categoryColors = {
    oceans: "bg-blue-500",
    countries: "bg-green-500", 
    mountains: "bg-orange-500"
  };

  const categoryTitles = {
    oceans: "Ozeane & Meere",
    countries: "Länder & Kontinente",
    mountains: "Gebirge & Berge"
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(categoryTitles).map(([key, title]) => (
            <Button
              key={key}
              variant={mapCategory === key ? "default" : "outline"}
              onClick={() => setMapCategory(key as any)}
              className="text-sm"
            >
              {title}
            </Button>
          ))}
        </div>
        
        <div className="relative bg-gradient-to-b from-blue-100 to-green-100 rounded-lg h-96 overflow-hidden border">
          {/* Weltkarte Hintergrund */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-green-200 to-blue-200 opacity-50"></div>
          
          {/* Kontinente als einfache Formen */}
          <div className="absolute top-20 left-16 w-20 h-16 bg-green-300 rounded-lg opacity-70" title="Nordamerika"></div>
          <div className="absolute top-32 left-12 w-16 h-20 bg-green-300 rounded-lg opacity-70" title="Südamerika"></div>
          <div className="absolute top-16 left-48 w-24 h-20 bg-green-300 rounded-lg opacity-70" title="Europa"></div>
          <div className="absolute top-12 left-56 w-32 h-24 bg-green-300 rounded-lg opacity-70" title="Asien"></div>
          <div className="absolute top-28 left-52 w-20 h-16 bg-green-300 rounded-lg opacity-70" title="Afrika"></div>
          <div className="absolute top-36 right-20 w-18 h-12 bg-green-300 rounded-lg opacity-70" title="Australien"></div>
          
          {/* Punkte für die geografischen Objekte */}
          {geographyData[mapCategory].map((item, index) => {
            if (!item.coordinates) return null;
            
            // Vereinfachte Koordinaten-zu-Pixel Umrechnung
            const x = ((item.coordinates[0] + 180) / 360) * 100;
            const y = ((90 - item.coordinates[1]) / 180) * 100;
            
            return (
              <div
                key={index}
                className={`absolute w-3 h-3 ${categoryColors[mapCategory]} rounded-full border-2 border-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform z-10`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setSelectedItem(item)}
                title={item.name}
              />
            );
          })}
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          Klicke auf die farbigen Punkte, um mehr Informationen zu erhalten.
        </p>
      </Card>

      {selectedItem && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
              <Badge className={`text-white ${categoryColors[mapCategory]}`}>
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
