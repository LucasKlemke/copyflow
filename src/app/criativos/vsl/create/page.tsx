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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type {
  ChatMessage,
  Project,
  SuggestedAction,
  VSLFormData,
  VSLResult,
} from "@/types";

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
  const [formData, setFormData] = useState<VSLFormData>({
    tipo: "",
    duracao: "",
    abordagem: "",
    cta: "",
    elementos: [],
  });

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

  const handleElementoToggle = (elementoId: string) => {
    setFormData(prev => ({
      ...prev,
      elementos: prev.elementos.includes(elementoId)
        ? prev.elementos.filter(id => id !== elementoId)
        : [...prev.elementos, elementoId],
    }));
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-vsl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao gerar VSL");
      }

      const result = await response.json();
      setVslResult(result.data);
      setEditableScript(result.data.script);
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
      }
    }, 1500);
  };

  const isFormValid =
    formData.tipo && formData.duracao && formData.abordagem && formData.cta;

  return (
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
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Criar VSL</h1>
          <p className="text-sm text-gray-600">
            Configure os parâmetros para gerar seu script de VSL personalizado
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. Tipo de VSL */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Tipo de VSL</CardTitle>
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
                      <p className="text-sm text-gray-600">{tipo.subtitle}</p>
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

        {/* 2. Duração Desejada */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Duração Desejada</CardTitle>
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

        {/* 3. Abordagem Principal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Abordagem Principal</CardTitle>
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
                    setFormData(prev => ({ ...prev, abordagem: abordagem.id }))
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

        {/* 4. Call-to-Action Final */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">4. Call-to-Action Final</CardTitle>
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

        {/* 5. Elementos Extras */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              5. Elementos Extras (Múltipla escolha)
            </CardTitle>
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
          <div className="fixed inset-0 z-50 bg-white">
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
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Salvar VSL
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
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={currentMessage}
                          onChange={e => setCurrentMessage(e.target.value)}
                          onKeyPress={e => {
                            if (e.key === "Enter") {
                              handleSendMessage();
                            }
                          }}
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
                    <h2 className="text-lg font-medium">Script da VSL</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Última atualização: agora</span>
                    </div>
                  </div>
                </div>

                {/* Editable Content */}
                <div className="flex-1 p-6">
                  <Textarea
                    value={editableScript}
                    onChange={e => setEditableScript(e.target.value)}
                    className="min-h-full w-full resize-none border-0 p-0 font-mono text-sm leading-relaxed focus:ring-0"
                    placeholder="Seu script VSL aparecerá aqui..."
                  />
                </div>

                {/* VSL Stats */}
                <div className="border-t bg-gray-50 px-6 py-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {editableScript.split(" ").length}
                      </div>
                      <div className="text-xs text-gray-600">Palavras</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {vslResult.tempoEstimado.total}
                      </div>
                      <div className="text-xs text-gray-600">Duração</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {vslResult.slides.length}
                      </div>
                      <div className="text-xs text-gray-600">Slides</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {vslResult.ctasPositions.length}
                      </div>
                      <div className="text-xs text-gray-600">CTAs</div>
                    </div>
                  </div>
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

        {/* Resultado Preview - only show if no results yet */}
        {!vslResult && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg text-green-800">
                Resultado Gerado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-green-700">
                <p>✓ Script completo da VSL</p>
                <p>✓ Slides sugeridos (títulos)</p>
                <p>✓ Tempo estimado por seção</p>
                <p>✓ CTAs strategicamente posicionados</p>
                <p>✓ Versão para teleprompter</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isGenerating}
            className="min-w-48 bg-blue-600 hover:bg-blue-700"
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
        </div>
      </div>
    </div>
  );
}
