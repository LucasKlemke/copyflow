"use client";

import React, { useEffect, useState } from "react";

import { Brain, FileText, Lightbulb, Sparkles, Zap } from "lucide-react";

interface VSLLoadingProps {
  isVisible: boolean;
}

const loadingSteps = [
  {
    id: 1,
    text: "Analisando suas configurações...",
    subtext: "Processando tipo, duração e abordagem escolhidos",
    icon: Brain,
    duration: 1200,
  },
  {
    id: 2,
    text: "Criando estrutura da VSL...",
    subtext: "Definindo ganchos irresistíveis e pontos de conversão",
    icon: FileText,
    duration: 1400,
  },
  {
    id: 3,
    text: "Aplicando psicologia da persuasão...",
    subtext: "Integrando gatilhos mentais e técnicas de copywriting",
    icon: Lightbulb,
    duration: 1600,
  },
  {
    id: 4,
    text: "Otimizando para conversão...",
    subtext: "Ajustando cada palavra para máximo impacto",
    icon: Zap,
    duration: 1400,
  },
  {
    id: 5,
    text: "Finalizando sua VSL...",
    subtext: "Última revisão para garantir perfeição",
    icon: Sparkles,
    duration: 1200,
  },
];

const motivationalTips = [
  "💡 VSLs bem estruturadas podem aumentar conversões em até 300%",
  "🎯 O gancho perfeito prende a atenção nos primeiros 8 segundos",
  "📈 87% das vendas online acontecem através de vídeos persuasivos",
  "✨ A prova social pode aumentar a credibilidade em 92%",
  "🧠 Gatilhos de escassez elevam a urgência de compra em 250%",
  "🎬 VSLs convertem 4x mais que textos estáticos",
];

export function VSLLoading({ isVisible }: VSLLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  const [currentTip, setCurrentTip] = useState(0);
  const [isApiComplete, setIsApiComplete] = useState(false);
  const [shouldAccelerate, setShouldAccelerate] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showTimeIndicator, setShowTimeIndicator] = useState(false);

  // Expose method to signal API completion
  useEffect(() => {
    if (isVisible) {
      // Listen for API completion signal
      const handleApiComplete = () => {
        setIsApiComplete(true);
        if (progress < 95) {
          setShouldAccelerate(true);
        }
      };

      window.addEventListener("vsl-api-complete", handleApiComplete);
      return () => {
        window.removeEventListener("vsl-api-complete", handleApiComplete);
      };
    }
  }, [isVisible, progress]);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      setCurrentTip(0);
      setIsApiComplete(false);
      setShouldAccelerate(false);
      setElapsedTime(0);
      setShowTimeIndicator(false);
      return;
    }

    let stepInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    let tipInterval: NodeJS.Timeout;
    let currentStepIndex = 0;
    let currentProgress = 0;

    // Rotate tips every 3 seconds
    tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % motivationalTips.length);
    }, 3000);

    // Smart progress simulation
    const updateProgress = () => {
      const maxProgress = isApiComplete ? 100 : 95; // Don't go to 100% until API is complete
      const timeElapsed = Date.now() - startTime;
      const elapsedSeconds = Math.floor(timeElapsed / 1000);

      setElapsedTime(elapsedSeconds);

      // Show time indicator after 20 seconds
      if (elapsedSeconds >= 20 && !isApiComplete) {
        setShowTimeIndicator(true);
      }

      let targetProgress: number;

      if (shouldAccelerate && isApiComplete) {
        // Accelerate to 100% quickly when API is done
        targetProgress = Math.min(100, currentProgress + 5);
      } else if (timeElapsed < 10000) {
        // First 10 seconds: fast progress to 60%
        targetProgress = Math.min(60, (timeElapsed / 10000) * 60);
      } else if (timeElapsed < 30000) {
        // 10-30 seconds: slower progress to 85%
        targetProgress = Math.min(
          85,
          60 + ((timeElapsed - 10000) / 20000) * 25
        );
      } else {
        // After 30 seconds: very slow progress to 95%
        targetProgress = Math.min(
          maxProgress,
          85 + ((timeElapsed - 30000) / 30000) * 10
        );
      }

      currentProgress = targetProgress;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(progressInterval);
      }
    };

    const startTime = Date.now();
    progressInterval = setInterval(updateProgress, 200);

    // Step progression based on time
    const updateStep = () => {
      const timeElapsed = Date.now() - startTime;
      let targetStep: number;

      if (timeElapsed < 8000) {
        targetStep = 0;
      } else if (timeElapsed < 16000) {
        targetStep = 1;
      } else if (timeElapsed < 25000) {
        targetStep = 2;
      } else if (timeElapsed < 35000) {
        targetStep = 3;
      } else {
        targetStep = 4;
      }

      if (targetStep !== currentStepIndex) {
        setAnimationClass("animate-fade-out");
        setTimeout(() => {
          currentStepIndex = targetStep;
          setCurrentStep(currentStepIndex);
          setAnimationClass("animate-fade-in");
        }, 300);
      }
    };

    const stepUpdateInterval = setInterval(updateStep, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
      clearInterval(stepUpdateInterval);
    };
  }, [isVisible, isApiComplete, shouldAccelerate]);

  if (!isVisible) return null;

  const currentStepData = loadingSteps[currentStep];

  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      {/* Subtle background pattern */}
      <div className="from-muted/20 via-background to-muted/10 absolute inset-0 bg-gradient-to-br">
        <div className="from-primary/5 absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-to)_0%,_transparent_50%)]"></div>
      </div>

      {/* Subtle animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-float bg-primary/20 absolute h-1 w-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-8 text-center">
        {/* Logo/Brand area */}
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Zap className="text-primary h-12 w-12 animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <Zap className="text-primary/40 h-12 w-12 opacity-40" />
              </div>
            </div>
            <h1 className="text-foreground text-3xl font-bold">CopyFlow</h1>
          </div>
          <p className="text-muted-foreground mt-2 text-lg">
            Gerando sua VSL perfeita
          </p>
        </div>

        {/* Main loading animation */}
        <div className="relative">
          {/* Central pulsing circle */}
          <div className="relative flex h-32 w-32 items-center justify-center">
            {/* Outer ring */}
            <div className="border-t-primary/60 border-r-primary/40 absolute inset-0 animate-spin rounded-full border-4 border-transparent"></div>
            {/* Middle ring */}
            <div
              className="border-b-primary/50 border-l-primary/30 absolute inset-2 animate-spin rounded-full border-4 border-transparent"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
            {/* Inner circle */}
            <div className="bg-primary relative flex h-16 w-16 items-center justify-center rounded-full border shadow-lg">
              {currentStepData && (
                <currentStepData.icon className="text-primary-foreground h-8 w-8 animate-pulse" />
              )}
            </div>
          </div>

          {/* Floating icons */}
          <div className="absolute -inset-16">
            {[Brain, FileText, Lightbulb, Sparkles].map((Icon, index) => (
              <div
                key={index}
                className="animate-orbit absolute"
                style={{
                  transformOrigin: "80px 80px",
                  animationDelay: `${index * 0.5}s`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-12px",
                  marginTop: "-12px",
                }}
              >
                <div
                  className="bg-card flex h-8 w-8 items-center justify-center rounded-full border shadow-sm"
                  style={{
                    transform: `rotate(${index * 90}deg) translateX(60px) rotate(${-index * 90}deg)`,
                  }}
                >
                  <Icon className="text-muted-foreground h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-80">
          <div className="text-muted-foreground mb-2 flex justify-between text-sm">
            <span>Progresso</span>
            <div className="flex items-center gap-2">
              <span>{Math.round(progress)}%</span>
              {showTimeIndicator && (
                <span className="text-xs">• {elapsedTime}s</span>
              )}
            </div>
          </div>
          <div className="bg-secondary h-3 overflow-hidden rounded-lg border">
            <div
              className="bg-primary relative h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="animate-shimmer via-primary-foreground/20 h-full w-full bg-gradient-to-r from-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Current step text */}
        {currentStepData && (
          <div
            className={`space-y-2 transition-all duration-300 ${animationClass}`}
          >
            <h2 className="text-foreground text-xl font-semibold">
              {currentStepData.text}
            </h2>
            <p className="text-muted-foreground">{currentStepData.subtext}</p>
          </div>
        )}

        {/* Motivational text */}
        <div className="space-y-3 text-center">
          <div className="text-primary flex items-center justify-center space-x-2">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-medium">
              {showTimeIndicator
                ? "Processamento complexo em andamento"
                : "Criando conteúdo de alta conversão"}
            </span>
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm">
            {showTimeIndicator
              ? "VSLs mais complexas podem levar até 1 minuto para serem criadas com perfeição"
              : "Nossa IA está aplicando as melhores técnicas de copywriting para sua VSL"}
          </p>
        </div>

        {/* Dynamic tips */}
        <div className="bg-card mt-8 rounded-lg border px-6 py-4 shadow-sm transition-all duration-500">
          <p className="animate-fade-in text-muted-foreground text-sm">
            <strong className="text-foreground">Dica:</strong>{" "}
            {motivationalTips[currentTip]}
          </p>
        </div>
      </div>

      {/* Custom animations styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-out {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-orbit {
          animation: orbit 8s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-fade-out {
          animation: fade-out 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}
