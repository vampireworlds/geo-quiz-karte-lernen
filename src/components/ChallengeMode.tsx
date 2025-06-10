
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { geographyData } from "@/data/geographyData";
import { CheckCircle, XCircle, RotateCcw, Target } from "lucide-react";
import { InteractiveMap } from "./InteractiveMap";

export const ChallengeMode = () => {
  const [selectedCategory, setSelectedCategory] = useState<"oceans" | "countries" | "mountains">("oceans");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeData, setChallengeData] = useState<any[]>([]);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<any>(null);
  const [userClicked, setUserClicked] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const categoryTitles = {
    oceans: "Ozeane & Meere",
    countries: "Länder & Kontinente",
    mountains: "Gebirge & Berge"
  };

  useEffect(() => {
    startChallenge();
  }, [selectedCategory]);

  const startChallenge = () => {
    const data = [...geographyData[selectedCategory]].filter(item => item.coordinates);
    const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 8);
    setChallengeData(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setIsGameComplete(false);
    setCurrentTarget(shuffled[0]);
    setUserClicked(false);
    setFeedback(null);
  };

  const handleMapClick = (clickedItem: any) => {
    if (userClicked) return;
    
    setUserClicked(true);
    const isCorrect = clickedItem.name === currentTarget.name;
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= challengeData.length) {
      setIsGameComplete(true);
    } else {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      setCurrentTarget(challengeData[nextQ]);
      setUserClicked(false);
      setFeedback(null);
    }
  };

  const resetChallenge = () => {
    startChallenge();
  };

  if (challengeData.length === 0) {
    return <div className="text-center text-muted-foreground">Lade Challenge...</div>;
  }

  if (isGameComplete) {
    const percentage = Math.round((score / challengeData.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Challenge abgeschlossen!</h2>
          <p className="text-xl text-muted-foreground">
            Du hast {score} von {challengeData.length} richtig gefunden
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary">{percentage}%</div>
          <Progress value={percentage} className="w-full max-w-md mx-auto" />
        </div>
        
        <div className="space-y-2">
          {percentage >= 80 && (
            <p className="text-green-400 font-semibold">Ausgezeichnet! Du kennst dich super aus! 🎯</p>
          )}
          {percentage >= 60 && percentage < 80 && (
            <p className="text-yellow-400 font-semibold">Gut gemacht! Noch ein bisschen üben. 👍</p>
          )}
          {percentage < 60 && (
            <p className="text-red-400 font-semibold">Mehr Übung nötig. Du schaffst das! 💪</p>
          )}
        </div>
        
        <Button onClick={resetChallenge} className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Neue Challenge starten
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6" />
            Challenge: {categoryTitles[selectedCategory]}
          </h2>
          <Badge variant="outline">
            {currentQuestion + 1} / {challengeData.length}
          </Badge>
        </div>
        
        <Progress value={((currentQuestion + 1) / challengeData.length) * 100} className="mb-6" />
        
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(categoryTitles).map(([key, title]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              onClick={() => setSelectedCategory(key as any)}
              className="text-sm"
              disabled={userClicked}
            >
              {title}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Klicke auf der Karte auf: <span className="text-primary">{currentTarget?.name}</span>
          </h3>
          
          {currentTarget?.description && (
            <p className="text-muted-foreground">{currentTarget.description}</p>
          )}
          
          {feedback && (
            <div className="space-y-2">
              {feedback === "correct" ? (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-lg font-semibold">Richtig! Gut gemacht! 🎯</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-400">
                  <XCircle className="w-6 h-6" />
                  <span className="text-lg font-semibold">Falsch! Das war: {currentTarget.name}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <InteractiveMap 
        selectedCategory={selectedCategory} 
        onMapClick={handleMapClick}
        highlightTarget={currentTarget}
        disabled={userClicked}
      />
      
      <Card className="p-4 bg-muted">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Score: {score} / {currentQuestion + (userClicked ? 1 : 0)}
          </p>
        </div>
      </Card>
    </div>
  );
};
