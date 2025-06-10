
import { Button } from "@/components/ui/button";
import { MapPin, BookOpen, Trophy, Target } from "lucide-react";

interface NavigationTabsProps {
  activeTab: "study" | "quiz" | "map" | "challenge";
  onTabChange: (tab: "study" | "quiz" | "map" | "challenge") => void;
}

export const NavigationTabs = ({ activeTab, onTabChange }: NavigationTabsProps) => {
  return (
    <div className="flex justify-center">
      <div className="bg-card rounded-lg p-1 shadow-sm border">
        <Button
          variant={activeTab === "study" ? "default" : "ghost"}
          onClick={() => onTabChange("study")}
          className="flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Lernen
        </Button>
        <Button
          variant={activeTab === "quiz" ? "default" : "ghost"}
          onClick={() => onTabChange("quiz")}
          className="flex items-center gap-2"
        >
          <Trophy className="w-4 h-4" />
          Quiz
        </Button>
        <Button
          variant={activeTab === "challenge" ? "default" : "ghost"}
          onClick={() => onTabChange("challenge")}
          className="flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          Challenge
        </Button>
        <Button
          variant={activeTab === "map" ? "default" : "ghost"}
          onClick={() => onTabChange("map")}
          className="flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          Karte
        </Button>
      </div>
    </div>
  );
};
