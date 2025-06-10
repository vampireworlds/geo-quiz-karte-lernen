
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { geographyData } from "@/data/geographyData";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

export const QuizMode = () => {
  const [selectedCategory, setSelectedCategory] = useState<"oceans" | "countries" | "mountains">("oceans");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const categoryTitles = {
    oceans: "Ozeane & Meere",
    countries: "Länder & Kontinente",
    mountains: "Gebirge & Berge"
  };

  useEffect(() => {
    startQuiz();
  }, [selectedCategory]);

  const startQuiz = () => {
    const data = [...geographyData[selectedCategory]];
    const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizData(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setShowAnswer(false);
    setIsQuizComplete(false);
    setUserAnswer("");
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= quizData.length) {
      setIsQuizComplete(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
      setUserAnswer("");
    }
  };

  const resetQuiz = () => {
    startQuiz();
  };

  if (quizData.length === 0) {
    return <div>Lade Quiz...</div>;
  }

  if (isQuizComplete) {
    const percentage = Math.round((score / quizData.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Quiz abgeschlossen!</h2>
          <p className="text-xl text-muted-foreground">
            Du hast {score} von {quizData.length} Fragen richtig beantwortet
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary">{percentage}%</div>
          <Progress value={percentage} className="w-full max-w-md mx-auto" />
        </div>
        
        <div className="space-y-2">
          {percentage >= 80 && (
            <p className="text-green-600 font-semibold">Ausgezeichnet! Du bist gut vorbereitet! 🎉</p>
          )}
          {percentage >= 60 && percentage < 80 && (
            <p className="text-yellow-600 font-semibold">Gut gemacht! Noch ein bisschen üben. 👍</p>
          )}
          {percentage < 60 && (
            <p className="text-red-600 font-semibold">Mehr Übung nötig. Du schaffst das! 💪</p>
          )}
        </div>
        
        <Button onClick={resetQuiz} className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Neues Quiz starten
        </Button>
      </Card>
    );
  }

  const currentItem = quizData[currentQuestion];
  const options = [
    currentItem.name,
    ...geographyData[selectedCategory]
      .filter(item => item.name !== currentItem.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(item => item.name)
  ].sort(() => 0.5 - Math.random());

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">Quiz: {categoryTitles[selectedCategory]}</h2>
          <Badge variant="outline">
            {currentQuestion + 1} / {quizData.length}
          </Badge>
        </div>
        
        <Progress value={((currentQuestion + 1) / quizData.length) * 100} className="mb-6" />
        
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(categoryTitles).map(([key, title]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              onClick={() => setSelectedCategory(key as any)}
              className="text-sm"
              disabled={showAnswer}
            >
              {title}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-8 space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            {currentItem.description ? (
              <>Wo befindet sich: {currentItem.description}?</>
            ) : (
              <>Was ist "{currentItem.name}"?</>
            )}
          </h3>
          
          {currentItem.code && (
            <Badge variant="outline">Code: {currentItem.code}</Badge>
          )}
        </div>

        {!showAnswer ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleAnswer(option === currentItem.name)}
                className="p-4 h-auto text-wrap"
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              {userAnswer === currentItem.name ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-lg font-semibold">Richtig!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <XCircle className="w-6 h-6" />
                  <span className="text-lg font-semibold">Falsch!</span>
                </div>
              )}
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold">Richtige Antwort: {currentItem.name}</p>
                {currentItem.description && (
                  <p className="text-sm text-muted-foreground mt-1">{currentItem.description}</p>
                )}
              </div>
            </div>
            
            <Button onClick={nextQuestion} className="w-full">
              {currentQuestion + 1 >= quizData.length ? "Quiz beenden" : "Nächste Frage"}
            </Button>
          </div>
        )}
      </Card>
      
      <Card className="p-4 bg-muted">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Aktueller Score: {score} / {currentQuestion + (showAnswer ? 1 : 0)}
          </p>
        </div>
      </Card>
    </div>
  );
};
