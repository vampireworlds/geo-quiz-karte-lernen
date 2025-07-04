
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StudyMode } from "@/components/StudyMode";
import { QuizMode } from "@/components/QuizMode";
import { ChallengeMode } from "@/components/ChallengeMode";
import { MapContainer } from "@/components/MapContainer";
import { NavigationTabs } from "@/components/NavigationTabs";
import { MapPin } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"study" | "quiz" | "map" | "challenge">("study");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
            <MapPin className="w-8 h-8 text-primary" />
            Geografie Lernkarte
          </h1>
          <p className="text-lg text-muted-foreground">
            Bereite dich optimal auf deine mündliche Prüfung vor!
          </p>
        </div>

        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="w-full">
          {activeTab === "study" && <StudyMode />}
          {activeTab === "quiz" && <QuizMode />}
          {activeTab === "challenge" && <ChallengeMode />}
          {activeTab === "map" && <MapContainer />}
        </div>
      </div>
    </div>
  );
};

export default Index;
