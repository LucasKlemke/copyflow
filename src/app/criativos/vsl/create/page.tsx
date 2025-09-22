"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Check,
  Download,
  Edit3,
  Lightbulb,
  Loader2,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Send,
  X,
  Zap,
} from "lucide-react";

import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { AutocompleteTextarea } from "@/components/ui/autocomplete-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VSLLoading } from "@/components/ui/vsl-loading";
import type {
  ChatMessage,
  Creative,
  Project,
  VSLFormData,
  VSLResult,
} from "@/types/project";

// Types are now imported from @/types

const tiposVSL = [
  { id: "curta", label: "VSL Curta", subtitle: "Produto até R$ 497" },
  { id: "media", label: "VSL Média", subtitle: "Produto R$ 497-1.997" },
  { id: "longa", label: "VSL Longa", subtitle: "Produto R$ 1.997+" },
];

const duracoes = [
  { id: "5-8", label: "5-8 minutos" },
  { id: "12-15", label: "12-15 minutos" },
  { id: "20-25", label: "20-25 minutos" },
  { id: "30+", label: "30+ minutos" },
];

const abordagens = [
  {
    id: "historia",
    label: "História Pessoal",
    subtitle: "storytelling",
    emoji: "📖",
  },
  {
    id: "dados",
    label: "Dados e Estatísticas",
    subtitle: "autoridade",
    emoji: "📊",
  },
  { id: "problema", label: "Problema Urgente", subtitle: "dor", emoji: "🔥" },
  {
    id: "revelacao",
    label: "Revelação/Descoberta",
    subtitle: "curiosidade",
    emoji: "💡",
  },
];

const ctas = [
  { id: "botao", label: "Clique no botão abaixo" },
  { id: "link", label: "Acesse o link na descrição" },
  { id: "whatsapp", label: "Envie mensagem no WhatsApp" },
  { id: "telefone", label: "Ligue agora pelo telefone" },
];

const elementos = [
  {
    id: "prova-social",
    label: "Prova Social",
    subtitle: "depoimentos",
    emoji: "✅",
  },
  {
    id: "urgencia",
    label: "Urgência",
    subtitle: "tempo limitado",
    emoji: "⏰",
  },
  {
    id: "escassez",
    label: "Escassez",
    subtitle: "vagas limitadas",
    emoji: "💰",
  },
  { id: "bonus", label: "Bônus Exclusivos", subtitle: "", emoji: "🎁" },
  { id: "garantia", label: "Garantia Destacada", subtitle: "", emoji: "📞" },
];

const suggestedActions = [
  {
    id: "improve-hook",
    label: "Melhorar Gancho",
    description: "Torne a abertura mais impactante",
    icon: Zap,
    actionType: "improve" as const,
  },
  {
    id: "add-urgency",
    label: "Adicionar Urgência",
    description: "Insira elementos de escassez de tempo",
    icon: Lightbulb,
    actionType: "improve" as const,
  },
  {
    id: "enhance-cta",
    label: "Fortalecer CTA",
    description: "Melhore o call-to-action final",
    icon: Edit3,
    actionType: "improve" as const,
  },
  {
    id: "add-social-proof",
    label: "Incluir Prova Social",
    description: "Adicione depoimentos e casos de sucesso",
    icon: MessageSquare,
    actionType: "improve" as const,
  },
];

export default function CreateVSL() {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VSLFormData>({
    tipo: "",
    duracao: "",
    abordagem: "",
    cta: "",
    elementos: [],
  });

  const totalSteps = 7; // 1 title + 5 config steps + 1 review step

  useEffect(() => {
    // Check authentication and project
    const user = localStorage.getItem("user");
    const currentProject = localStorage.getItem("currentProject");

    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!currentProject) {
      router.push("/onboarding");
      return;
    }

    setProject(JSON.parse(currentProject));
  }, [router]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [vslResult, setVslResult] = useState<VSLResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentVSL, setCurrentVSL] = useState<Creative | null>(null);
  const [vslTitle, setVslTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Editor state
  const [editableScript, setEditableScript] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Olá! Estou aqui para ajudar você a aprimorar sua VSL. Que tipo de melhoria você gostaria de fazer?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true);
  const [isFabOpen, setIsFabOpen] = useState(false);

  // Utility functions for real-time stats
  const calculateWordCount = (text: string): number => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const calculateReadingTime = (text: string): string => {
    const words = calculateWordCount(text);
    const wordsPerMinute = 150; // Average speaking rate
    const minutes = Math.ceil(words / wordsPerMinute);

    if (minutes < 1) return "< 1 min";
    if (minutes === 1) return "1 min";
    return `${minutes} min`;
  };

  const calculateCharacterCount = (text: string): number => {
    return text.length;
  };

  const countParagraphs = (text: string): number => {
    if (!text.trim()) return 0;
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  };

  const countCTAs = (text: string): number => {
    // Common CTA phrases in Portuguese
    const ctaPatterns = [
      /clique\s+(?:no\s+)?botão/gi,
      /acesse\s+(?:o\s+)?link/gi,
      /compre\s+agora/gi,
      /adquira\s+(?:já|agora)/gi,
      /garanta\s+(?:sua|a)\s+vaga/gi,
      /aproveite\s+(?:essa|esta)\s+oferta/gi,
      /não\s+perca/gi,
      /última\s+chance/gi,
      /entre\s+em\s+contato/gi,
      /cadastre-se/gi,
      /inscreva-se/gi,
    ];

    return ctaPatterns.reduce((count, pattern) => {
      const matches = text.match(pattern);
      return count + (matches ? matches.length : 0);
    }, 0);
  };

  const estimateVideoLength = (text: string): string => {
    const words = calculateWordCount(text);
    const wordsPerMinute = 140; // Slightly slower for video
    const totalMinutes = words / wordsPerMinute;

    if (totalMinutes < 1) return "< 1 min";

    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);

    if (minutes === 0) return `${seconds}s`;
    if (seconds === 0) return `${minutes} min`;
    return `${minutes}:${seconds.toString().padStart(2, "0")} min`;
  };

  const getContentQualityScore = (
    text: string
  ): { score: number; feedback: string } => {
    const words = calculateWordCount(text);
    const ctas = countCTAs(text);
    const paragraphs = countParagraphs(text);

    let score = 0;
    let feedback = "";

    // Word count scoring (0-40 points)
    if (words >= 800) score += 40;
    else if (words >= 500) score += 30;
    else if (words >= 300) score += 20;
    else if (words >= 100) score += 10;

    // CTA scoring (0-30 points)
    if (ctas >= 3) score += 30;
    else if (ctas >= 2) score += 20;
    else if (ctas >= 1) score += 10;

    // Structure scoring (0-30 points)
    if (paragraphs >= 8) score += 30;
    else if (paragraphs >= 5) score += 20;
    else if (paragraphs >= 3) score += 10;

    // Generate feedback
    if (score >= 80) feedback = "Excelente! VSL bem estruturada";
    else if (score >= 60) feedback = "Boa estrutura, pode melhorar";
    else if (score >= 40) feedback = "Estrutura básica, adicione mais conteúdo";
    else if (score >= 20) feedback = "Precisa de mais desenvolvimento";
    else feedback = "Comece escrevendo seu script";

    return { score, feedback };
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const handleElementoToggle = (elementoId: string) => {
    setFormData(prev => ({
      ...prev,
      elementos: prev.elementos.includes(elementoId)
        ? prev.elementos.filter(id => id !== elementoId)
        : [...prev.elementos, elementoId],
    }));
  };

  const saveVSL = async (autoSave = false) => {
    if (!project || (!vslTitle.trim() && !autoSave)) {
      if (!autoSave) {
        setError("Por favor, insira um título para a VSL");
      }
      return;
    }

    setIsSaving(true);
    try {
      const vslData = {
        title: vslTitle || `VSL ${new Date().toLocaleDateString()}`,
        content: editableScript,
        type: "VSL" as const,
        projectId: project.id,
        status: vslResult ? "DRAFT" : ("DRAFT" as const),
        vslParameters: formData,
        chatHistory: chatMessages,
      };

      let response;
      if (currentVSL) {
        // Update existing VSL
        response = await fetch(`/api/creatives/${currentVSL.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vslData),
        });
      } else {
        // Create new VSL
        response = await fetch("/api/creatives", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vslData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar VSL");
      }

      const savedVSL = await response.json();
      setCurrentVSL(savedVSL);

      if (!autoSave) {
        // Show success message or redirect
        console.log("VSL salva com sucesso!");
      }
    } catch (err) {
      if (!autoSave) {
        setError(err instanceof Error ? err.message : "Erro ao salvar VSL");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Prepare request data with project information
      const requestData = {
        ...formData,
        projectId: project?.id,
        projectData: project
          ? {
              nicho: project.nicho || "",
              modeloNegocio: project.modeloNegocio || "",
              publicoIdeal: project.publicoIdeal || "",
              faixaPreco: project.faixaPreco || "",
              promessaPrincipal: project.promessaPrincipal || "",
              diferencialCompetitivo:
                typeof project.diferencialCompetitivo === "string"
                  ? JSON.parse(project.diferencialCompetitivo)
                  : project.diferencialCompetitivo || [],
              nivelMarketingDigital: project.nivelMarketingDigital || "",
              nivelCopywriting: project.nivelCopywriting || "",
              faturamentoAtual: project.faturamentoAtual || "",
              principalDesafio: project.principalDesafio || "",
            }
          : undefined,
      };

      // Log data being sent for debugging
      console.log("🚀 Sending VSL Generation Request:");
      console.log("- Title:", vslTitle);
      console.log("- Project:", project?.name);
      console.log("- Form Data:", formData);
      console.log("- Project Data Available:", !!requestData.projectData);
      if (requestData.projectData) {
        console.log("- Project Context:", {
          nicho: requestData.projectData.nicho,
          modeloNegocio: requestData.projectData.modeloNegocio,
          publicoIdeal: requestData.projectData.publicoIdeal,
        });
      }

      // Start the actual API call
      const response = await fetch("/api/generate-vsl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      // Signal that API call is complete
      window.dispatchEvent(new CustomEvent("vsl-api-complete"));

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao gerar VSL");
      }

      const result = await response.json();

      // Wait a bit for the progress to reach 100% smoothly
      await new Promise(resolve => setTimeout(resolve, 1500));

      setVslResult(result.data);
      setEditableScript(result.data.script);

      // Auto-save after generation if we have a title
      if (vslTitle.trim()) {
        await saveVSL(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: currentMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Mock AI response
    setTimeout(() => {
      const responses = [
        "Ótima sugestão! Vou ajudar você a melhorar esse aspecto da VSL.",
        "Entendo o que você quer fazer. Que tal tentarmos esta abordagem?",
        "Perfeito! Vamos trabalhar nisso juntos. Aqui está uma sugestão:",
        "Excelente ideia! Vou gerar algumas opções para você escolher.",
      ];

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setCurrentMessage("");
  };

  const handleSuggestedAction = (actionId: string) => {
    const action = suggestedActions.find(a => a.id === actionId);
    if (!action) return;

    // Add action as user message
    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Executar ação: ${action.label}`,
      isUser: true,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, actionMessage]);

    // Mock AI response with specific improvements
    setTimeout(() => {
      let aiResponse = "";
      let scriptImprovement = "";

      switch (actionId) {
        case "improve-hook":
          aiResponse =
            "Melhorei o gancho da sua VSL! Veja como ficou mais impactante:";
          scriptImprovement = editableScript.replace(
            /Olá, meu nome é/,
            "PARE TUDO! Se você tem [PROBLEMA], você precisa ver isso..."
          );
          break;
        case "add-urgency":
          aiResponse =
            "Adicionei elementos de urgência estratégicos na sua VSL:";
          scriptImprovement =
            editableScript +
            "\n\n⚠️ ÚLTIMA CHANCE: Esta oferta expira hoje à meia-noite!";
          break;
        case "enhance-cta":
          aiResponse =
            "Fortaleci seu call-to-action com técnicas de conversão:";
          scriptImprovement = editableScript.replace(
            /clique no botão/,
            "clique no botão VERMELHO abaixo AGORA MESMO"
          );
          break;
        case "add-social-proof":
          aiResponse = "Incluí prova social poderosa na sua VSL:";
          scriptImprovement = editableScript.replace(
            /### Prova Social/,
            `### Prova Social
"Consegui R$ 50.000 em apenas 30 dias!" - Maria Silva
"Minha vida mudou completamente!" - João Santos
+2.847 pessoas já transformaram suas vidas`
          );
          break;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, aiMessage]);
      if (scriptImprovement) {
        setEditableScript(scriptImprovement);
        // Auto-save after script improvement
        setTimeout(() => saveVSL(true), 2000);
      }
    }, 1500);
  };

  // Auto-save functionality
  useEffect(() => {
    if (editableScript && currentVSL && vslTitle) {
      const timeoutId = setTimeout(() => {
        saveVSL(true);
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [editableScript, chatMessages]);

  // Validation functions for each step
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!vslTitle.trim();
      case 2:
        return !!formData.tipo;
      case 3:
        return !!formData.duracao;
      case 4:
        return !!formData.abordagem;
      case 5:
        return !!formData.cta;
      case 6:
        return true; // elementos are optional
      case 7:
        return true; // review step
      default:
        return false;
    }
  };

  const isFormValid =
    vslTitle.trim() &&
    formData.tipo &&
    formData.duracao &&
    formData.abordagem &&
    formData.cta;

  // Navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  return (
    <>
      {/* VSL Loading Screen */}
      <VSLLoading isVisible={isGenerating} />

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-medium text-gray-900">Criar VSL</h1>
            <p className="text-sm text-gray-600">
              {currentStep === 1
                ? "Primeiro, dê um nome único para sua VSL"
                : currentStep === 7
                  ? "Revise suas configurações antes de gerar a VSL"
                  : "Configure os parâmetros para gerar seu script de VSL personalizado"}
            </p>
            {project && (
              <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                <span>
                  Usando dados do projeto "{project.name}" para personalização
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}% completo
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>

          {/* Step Indicators */}
          <div className="mt-4 flex justify-between">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
              <div
                key={step}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-medium transition-all ${
                  step < currentStep
                    ? "bg-blue-600 text-white"
                    : step === currentStep
                      ? "bg-blue-100 text-blue-600 ring-2 ring-blue-600"
                      : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => step <= currentStep && goToStep(step)}
              >
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="mt-2 flex justify-between">
            {[
              "Título",
              "Tipo",
              "Duração",
              "Abordagem",
              "CTA",
              "Elementos",
              "Revisão",
            ].map((label, index) => (
              <div
                key={index}
                className={`text-center text-xs ${
                  index + 1 === currentStep
                    ? "font-medium text-blue-600"
                    : "text-gray-500"
                }`}
                style={{ maxWidth: "60px" }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Step 1: Título da VSL */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Título da VSL</CardTitle>
                <p className="text-sm text-gray-600">
                  Escolha um nome único e descritivo para sua VSL
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                      Nome da VSL
                    </label>
                    <Input
                      value={vslTitle}
                      onChange={e => setVslTitle(e.target.value)}
                      placeholder="Ex: VSL Produto Revolucionário - Vendas 2024"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-600">
                      Este será o nome da sua VSL no dashboard e sistema
                    </p>
                  </div>

                  {project && (
                    <div className="rounded-lg bg-blue-50 p-4">
                      <h4 className="mb-2 font-medium text-blue-900">
                        📊 Projeto Selecionado
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                        <div>
                          <span className="font-medium text-blue-800">
                            Nome:
                          </span>
                          <span className="ml-2 text-blue-700">
                            {project.name}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">
                            Nicho:
                          </span>
                          <span className="ml-2 text-blue-700">
                            {project.nicho || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">
                            Público:
                          </span>
                          <span className="ml-2 text-blue-700">
                            {project.publicoIdeal || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">
                            Modelo:
                          </span>
                          <span className="ml-2 text-blue-700">
                            {project.modeloNegocio || "N/A"}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-blue-600">
                        ✨ Estas informações serão usadas para personalizar sua
                        VSL
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Tipo de VSL */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tipo de VSL</CardTitle>
                <p className="text-sm text-gray-600">
                  Escolha o tipo de VSL baseado no valor do seu produto
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {tiposVSL.map(tipo => (
                    <div
                      key={tipo.id}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-blue-300 ${
                        formData.tipo === tipo.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setFormData(prev => ({ ...prev, tipo: tipo.id }))
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {tipo.label}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {tipo.subtitle}
                          </p>
                        </div>
                        {formData.tipo === tipo.id && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Duração Desejada */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Duração Desejada</CardTitle>
                <p className="text-sm text-gray-600">
                  Selecione a duração ideal para sua VSL
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {duracoes.map(duracao => (
                    <div
                      key={duracao.id}
                      className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all hover:border-blue-300 ${
                        formData.duracao === duracao.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setFormData(prev => ({ ...prev, duracao: duracao.id }))
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium text-gray-900">
                          {duracao.label}
                        </span>
                        {formData.duracao === duracao.id && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Abordagem Principal */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Abordagem Principal</CardTitle>
                <p className="text-sm text-gray-600">
                  Escolha a estratégia principal para sua VSL
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {abordagens.map(abordagem => (
                    <div
                      key={abordagem.id}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-blue-300 ${
                        formData.abordagem === abordagem.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          abordagem: abordagem.id,
                        }))
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{abordagem.emoji}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {abordagem.label}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ({abordagem.subtitle})
                            </p>
                          </div>
                        </div>
                        {formData.abordagem === abordagem.id && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Call-to-Action Final */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Call-to-Action Final</CardTitle>
                <p className="text-sm text-gray-600">
                  Defina como o viewer deve tomar ação após assistir a VSL
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {ctas.map(cta => (
                    <div
                      key={cta.id}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-blue-300 ${
                        formData.cta === cta.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setFormData(prev => ({ ...prev, cta: cta.id }))
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          "{cta.label}"
                        </span>
                        {formData.cta === cta.id && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Elementos Extras */}
          {currentStep === 6 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Elementos Extras (Opcional)
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Selecione elementos adicionais para fortalecer sua VSL
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {elementos.map(elemento => (
                    <div
                      key={elemento.id}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-blue-300 ${
                        formData.elementos.includes(elemento.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleElementoToggle(elemento.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{elemento.emoji}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {elemento.label}
                            </h3>
                            {elemento.subtitle && (
                              <p className="text-sm text-gray-600">
                                ({elemento.subtitle})
                              </p>
                            )}
                          </div>
                        </div>
                        {formData.elementos.includes(elemento.id) && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 7: Revisão */}
          {currentStep === 7 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Revisão das Configurações
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Confirme suas escolhas antes de gerar a VSL
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Título da VSL</h4>
                    <p className="text-sm text-gray-600">
                      {vslTitle || "Sem título definido"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStep(1)}
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>

                {/* Project Context - only show if project data exists */}
                {project && (
                  <div className="mb-6 rounded-lg bg-blue-50 p-4">
                    <h4 className="mb-3 font-medium text-blue-900">
                      📊 Contexto do Projeto (será considerado na geração)
                    </h4>
                    <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                      <div>
                        <span className="font-medium text-blue-800">
                          Nicho:
                        </span>
                        <span className="ml-2 text-blue-700">
                          {project.nicho || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">
                          Modelo:
                        </span>
                        <span className="ml-2 text-blue-700">
                          {project.modeloNegocio || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">
                          Público:
                        </span>
                        <span className="ml-2 text-blue-700">
                          {project.publicoIdeal || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">
                          Faixa de Preço:
                        </span>
                        <span className="ml-2 text-blue-700">
                          {project.faixaPreco || "N/A"}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-blue-800">
                          Promessa:
                        </span>
                        <span className="ml-2 text-blue-700">
                          {project.promessaPrincipal || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tipo */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Tipo de VSL</h4>
                    <p className="text-sm text-gray-600">
                      {tiposVSL.find(t => t.id === formData.tipo)?.label} -{" "}
                      {tiposVSL.find(t => t.id === formData.tipo)?.subtitle}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStep(1)}
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>

                {/* Duração */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Duração</h4>
                    <p className="text-sm text-gray-600">
                      {duracoes.find(d => d.id === formData.duracao)?.label}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStep(3)}
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>

                {/* Abordagem */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Abordagem Principal
                    </h4>
                    <p className="text-sm text-gray-600">
                      {abordagens.find(a => a.id === formData.abordagem)?.emoji}{" "}
                      {abordagens.find(a => a.id === formData.abordagem)?.label}{" "}
                      (
                      {
                        abordagens.find(a => a.id === formData.abordagem)
                          ?.subtitle
                      }
                      )
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStep(4)}
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Call-to-Action
                    </h4>
                    <p className="text-sm text-gray-600">
                      "{ctas.find(c => c.id === formData.cta)?.label}"
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStep(5)}
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>

                {/* Elementos */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Elementos Extras
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formData.elementos.length > 0
                        ? formData.elementos
                            .map(el => elementos.find(e => e.id === el)?.label)
                            .join(", ")
                        : "Nenhum elemento extra selecionado"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStep(6)}
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-red-700">
                  <p className="font-medium">Erro ao gerar VSL:</p>
                  <p className="text-sm">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* VSL Editor Interface - Split Screen */}
          {vslResult && (
            <div className="animate-in fade-in fixed inset-0 z-50 bg-white duration-500">
              {/* Header */}
              <div className="border-b bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVslResult(null)}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <h1 className="text-xl font-semibold">Editor de VSL</h1>
                      <p className="text-sm text-gray-600">
                        Edite e melhore sua VSL com IA
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLeftPanelVisible(!isLeftPanelVisible)}
                    >
                      {isLeftPanelVisible ? (
                        <PanelLeftClose className="mr-2 h-4 w-4" />
                      ) : (
                        <PanelLeftOpen className="mr-2 h-4 w-4" />
                      )}
                      {isLeftPanelVisible ? "Ocultar Painel" : "Mostrar Painel"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => saveVSL()}
                      disabled={isSaving || !vslTitle.trim()}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar VSL"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Split Screen Content */}
              <div className="flex h-[calc(100vh-80px)]">
                {/* Left Panel - AI Chat & Actions */}
                {isLeftPanelVisible && (
                  <div className="flex w-1/3 flex-col border-r bg-gray-50">
                    {/* Suggested Actions */}
                    <div className="border-b bg-white p-4">
                      <h3 className="mb-3 font-medium text-gray-900">
                        Ações Sugeridas
                      </h3>
                      <div className="space-y-2">
                        {suggestedActions.map(action => {
                          const IconComponent = action.icon;
                          return (
                            <Button
                              key={action.id}
                              variant="ghost"
                              className="h-auto w-full justify-start p-3 hover:bg-blue-50"
                              onClick={() => handleSuggestedAction(action.id)}
                            >
                              <IconComponent className="mr-3 h-4 w-4 text-blue-600" />
                              <div className="text-left">
                                <div className="font-medium text-gray-900">
                                  {action.label}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {action.description}
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="flex flex-1 flex-col">
                      {/* Chat Messages */}
                      <div className="flex-1 space-y-4 overflow-y-auto p-4">
                        {chatMessages.map(message => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.isUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                message.isUser
                                  ? "bg-blue-600 text-white"
                                  : "border bg-white shadow-sm"
                              }`}
                            >
                              {message.text}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <div className="border-t bg-white p-4">
                        <div className="flex gap-2">
                          <AutocompleteInput
                            placeholder="Digite sua mensagem..."
                            value={currentMessage}
                            onChange={e => setCurrentMessage(e.target.value)}
                            onKeyPress={e => {
                              if (e.key === "Enter") {
                                handleSendMessage();
                              }
                            }}
                            enableAutocomplete={true}
                            minCharsForSuggestion={2}
                          />
                          <Button
                            size="sm"
                            onClick={handleSendMessage}
                            disabled={!currentMessage.trim()}
                            className="px-3"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Panel - Editable VSL Content */}
                <div className="flex flex-1 flex-col">
                  {/* Content Header */}
                  <div className="border-b bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-medium">Script da VSL</h2>
                        {editableScript.trim() && (
                          <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {calculateWordCount(editableScript)} palavras
                            </span>
                            <span>•</span>
                            <span>
                              {estimateVideoLength(editableScript)} estimado
                            </span>
                            <span>•</span>
                            <span
                              className={getScoreColor(
                                getContentQualityScore(editableScript).score
                              )}
                            >
                              {getContentQualityScore(editableScript).score}%
                              qualidade
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {editableScript.trim() && (
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-16 rounded-full bg-gray-200">
                              <div
                                className={`h-1 rounded-full transition-all duration-300 ${
                                  getContentQualityScore(editableScript)
                                    .score >= 80
                                    ? "bg-green-500"
                                    : getContentQualityScore(editableScript)
                                          .score >= 60
                                      ? "bg-yellow-500"
                                      : getContentQualityScore(editableScript)
                                            .score >= 40
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                }`}
                                style={{
                                  width: `${getContentQualityScore(editableScript).score}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              isSaving
                                ? "animate-pulse bg-yellow-500"
                                : currentVSL
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                            }`}
                          ></div>
                          <span>
                            {isSaving
                              ? "Salvando..."
                              : currentVSL
                                ? "Salvo automaticamente"
                                : "Não salvo"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editable Content */}
                  <div className="flex-1 p-6">
                    <AutocompleteTextarea
                      value={editableScript}
                      onChange={e => setEditableScript(e.target.value)}
                      className="h-[700px] w-full resize-none border-0 p-0 font-mono text-sm leading-relaxed focus:ring-0"
                      placeholder="Seu script VSL aparecerá aqui..."
                      enableAutocomplete={true}
                      minCharsForSuggestion={2}
                    />
                  </div>

                  {/* VSL Stats - Real-time */}
                  <div className="border-t bg-gray-50 px-6 py-4">
                    <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {calculateWordCount(editableScript)}
                        </div>
                        <div className="text-xs text-gray-600">Palavras</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {estimateVideoLength(editableScript)}
                        </div>
                        <div className="text-xs text-gray-600">
                          Duração Est.
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {countParagraphs(editableScript)}
                        </div>
                        <div className="text-xs text-gray-600">Parágrafos</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {countCTAs(editableScript)}
                        </div>
                        <div className="text-xs text-gray-600">CTAs</div>
                      </div>
                    </div>

                    {/* Additional stats row */}
                    <div className="mt-3 border-t border-gray-200 pt-3">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-xs font-medium text-gray-700">
                            {calculateCharacterCount(editableScript)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Caracteres
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-700">
                            {calculateReadingTime(editableScript)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Tempo Leitura
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-700">
                            {editableScript.split("\n").length}
                          </div>
                          <div className="text-xs text-gray-500">Linhas</div>
                        </div>
                      </div>
                    </div>

                    {/* Content Quality Score */}
                    {editableScript.trim() && (
                      <div className="mt-3 border-t border-gray-200 pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-700">
                              Qualidade do Conteúdo:
                            </span>
                            <span
                              className={`text-xs font-bold ${getScoreColor(getContentQualityScore(editableScript).score)}`}
                            >
                              {getContentQualityScore(editableScript).score}/100
                            </span>
                          </div>
                          <div className="mx-3 flex-1">
                            <div className="h-1.5 w-full rounded-full bg-gray-200">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  getContentQualityScore(editableScript)
                                    .score >= 80
                                    ? "bg-green-500"
                                    : getContentQualityScore(editableScript)
                                          .score >= 60
                                      ? "bg-yellow-500"
                                      : getContentQualityScore(editableScript)
                                            .score >= 40
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                }`}
                                style={{
                                  width: `${getContentQualityScore(editableScript).score}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 text-center">
                          <span className="text-xs text-gray-600">
                            {getContentQualityScore(editableScript).feedback}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Action Button - Only visible when left panel is hidden */}
              {!isLeftPanelVisible && (
                <div className="fixed right-6 bottom-6 z-50">
                  {/* Improvement Suggestions Popup */}
                  {isFabOpen && (
                    <div className="mb-4 w-80 rounded-lg border bg-white shadow-lg">
                      <div className="border-b p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            Melhorias Sugeridas
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setIsFabOpen(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-2">
                        {suggestedActions.map(action => {
                          const IconComponent = action.icon;
                          return (
                            <Button
                              key={action.id}
                              variant="ghost"
                              className="h-auto w-full justify-start p-3 hover:bg-blue-50"
                              onClick={() => {
                                handleSuggestedAction(action.id);
                                setIsFabOpen(false);
                              }}
                            >
                              <IconComponent className="mr-3 h-4 w-4 text-blue-600" />
                              <div className="text-left">
                                <div className="font-medium text-gray-900">
                                  {action.label}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {action.description}
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* FAB Button */}
                  <Button
                    className="h-14 w-14 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 hover:shadow-xl"
                    onClick={() => setIsFabOpen(!isFabOpen)}
                  >
                    {isFabOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Plus className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>

            <div className="flex gap-4">
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Próximo
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isGenerating}
                  className="min-w-48 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando VSL...
                    </>
                  ) : (
                    "Gerar VSL Completa"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
