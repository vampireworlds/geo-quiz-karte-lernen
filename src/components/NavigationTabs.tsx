
import { Button } from "@/components/ui/button";
import { MapPin, BookOpen, Trophy } from "lucide-react";

interface NavigationTabsProps {
  activeTab: "study" | "quiz" | "map";
  onTabChange: (tab: "study" | "quiz" | "map") => void;
}

export const NavigationTabs = ({ activeTab, onTabChange }: NavigationTabsProps) => {
  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-lg p-1 shadow-sm border">
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
