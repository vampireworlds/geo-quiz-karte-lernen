
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { geographyData } from "@/data/geographyData";
import { SimpleMap } from "./SimpleMap";

export const StudyMode = () => {
  const [selectedCategory, setSelectedCategory] = useState<"oceans" | "countries" | "mountains">("oceans");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const categoryTitles = {
    oceans: "Ozeane & Meere",
    countries: "Länder & Kontinente", 
    mountains: "Gebirge & Berge"
  };

  const categoryColors = {
    oceans: "bg-blue-100 text-blue-800",
    countries: "bg-green-100 text-green-800",
    mountains: "bg-orange-100 text-orange-800"
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 space-y-4">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Lernmodus</h2>
          
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryTitles).map(([key, title]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(key as any);
                  setSelectedItem(null);
                }}
                className="text-sm"
              >
                {title}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {geographyData[selectedCategory].map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedItem?.name === item.name
                  ? "bg-primary/10 border-primary"
                  : "bg-background border-border hover:bg-muted"
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
                <Badge className={categoryColors[selectedCategory]}>
                  {item.code || "Info"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        {selectedItem && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-3">{selectedItem.name}</h3>
            {selectedItem.description && (
              <p className="text-muted-foreground mb-3">{selectedItem.description}</p>
            )}
            {selectedItem.code && (
              <Badge className={categoryColors[selectedCategory]}>
                Code: {selectedItem.code}
              </Badge>
            )}
          </Card>
        )}
        
        <SimpleMap selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};
