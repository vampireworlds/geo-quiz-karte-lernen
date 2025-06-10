
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapContainer } from "@/components/MapContainer";
import { StudyMode } from "@/components/StudyMode";
import { QuizMode } from "@/components/QuizMode";
import { NavigationTabs } from "@/components/NavigationTabs";
import { MapPin, BookOpen, Trophy } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"study" | "quiz" | "map">("study");
  const [mapboxToken, setMapboxToken] = useState("");
  const [isTokenSet, setIsTokenSet] = useState(false);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
    }
  };

  if (!isTokenSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-4">
          <div className="text-center space-y-2">
            <MapPin className="w-12 h-12 text-blue-600 mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Geografie Lernkarte</h1>
            <p className="text-muted-foreground text-sm">
              Für deine mündliche Prüfung morgen!
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Bitte gib deinen Mapbox Public Token ein:
            </p>
            <Input
              type="text"
              placeholder="pk.eyJ1..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="font-mono text-xs"
            />
            <Button onClick={handleTokenSubmit} className="w-full">
              Lernkarte starten
            </Button>
            <p className="text-xs text-muted-foreground">
              Token findest du auf{" "}
              <a
                href="https://mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                mapbox.com
              </a>{" "}
              in deinem Dashboard
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            Geografie Lernkarte
          </h1>
          <p className="text-lg text-muted-foreground">
            Bereite dich optimal auf deine mündliche Prüfung vor!
          </p>
        </div>

        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="w-full">
          {activeTab === "study" && <StudyMode mapboxToken={mapboxToken} />}
          {activeTab === "quiz" && <QuizMode />}
          {activeTab === "map" && <MapContainer mapboxToken={mapboxToken} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
