"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  DollarSign,
  Dumbbell,
  GraduationCap,
  Heart,
  Home,
  Lightbulb,
  Loader2,
  Palette,
  Star,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import ProjetoSucesso from "./projeto-sucesso";

interface ProjetoFormData {
  // Passo 1: Identidade do Projeto
  nomeProjeto: string;

  // Passo 2: Nicho e Modelo
  nicho: string;
  modeloNegocio: string;

  // Passo 3: Público e Preço
  publicoIdeal: string;
  faixaPreco: string;

  // Passo 4: Promessa e Diferencial
  promessaPrincipal: string;
  diferencialCompetitivo: string[];

  // Passo 5: Validação e Experiência
  nivelMarketingDigital: string;
  nivelCopywriting: string;
  faturamentoAtual: string;
  principalDesafio: string;
}

interface ProjetoFormOtimizadoProps {
  mode: "create" | "edit" | "onboarding";
  initialData?: Partial<ProjetoFormData>;
  projectId?: string;
  onSubmit: (data: ProjetoFormData) => Promise<void>;
  onCancel?: () => void;
}

const NICHOS = [
  {
    id: "fitness",
    label: "FITNESS & SAÚDE",
    icon: Dumbbell,
    trend: "Popular",
    color: "bg-green-50 border-green-200 text-green-700",
  },
  {
    id: "dinheiro",
    label: "DINHEIRO & INVESTIMENTOS",
    icon: DollarSign,
    trend: "Hot 🔥",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
  },
  {
    id: "educacao",
    label: "EDUCAÇÃO & CURSOS",
    icon: GraduationCap,
    trend: "Estável",
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    id: "business",
    label: "BUSINESS & EMPREENDEDORISMO",
    icon: Briefcase,
    trend: "Crescendo",
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
  {
    id: "relacionamentos",
    label: "RELACIONAMENTOS",
    icon: Heart,
    trend: "Nicho",
    color: "bg-pink-50 border-pink-200 text-pink-700",
  },
  {
    id: "casa",
    label: "CASA & FAMÍLIA",
    icon: Home,
    trend: "Familiar",
    color: "bg-orange-50 border-orange-200 text-orange-700",
  },
  {
    id: "arte",
    label: "ARTE & CRIATIVIDADE",
    icon: Palette,
    trend: "Criativo",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    id: "tech",
    label: "TECNO & SOFTWARE",
    icon: Wrench,
    trend: "Tech",
    color: "bg-gray-50 border-gray-200 text-gray-700",
  },
];

const MODELOS_NEGOCIO = [
  {
    id: "infoproduto",
    label: "Infoproduto",
    desc: "Curso, Ebook, Mentoria",
    icon: "📚",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    desc: "Produtos físicos",
    icon: "🛒",
  },
  { id: "saas", label: "SaaS/Software", desc: "Assinatura mensal", icon: "💻" },
  { id: "servicos", label: "Serviços/Consultoria", desc: "", icon: "🤝" },
  { id: "afiliados", label: "Marketing de Afiliados", desc: "", icon: "🎯" },
  { id: "agencia", label: "Agência/Freelancer", desc: "", icon: "🏢" },
];

const PERSONAS_POR_NICHO = {
  fitness: [
    {
      id: "mulher-executiva",
      title: "👩‍💼 MULHER EXECUTIVA",
      desc: "25-40 anos • Sem tempo • Renda: R$ 5-15k • Foco: Praticidade",
      dores: "Principais dores: Falta de tempo, estresse, autoestima",
    },
    {
      id: "mae-ocupada",
      title: "👩‍👧‍👦 MÃE OCUPADA",
      desc: "28-42 anos • Filhos pequenos • Renda: R$ 3-8k • Foco: Casa",
      dores: "Principais dores: Tempo para si, energia, peso pós-parto",
    },
    {
      id: "homem-sedentario",
      title: "👨‍💻 HOMEM SEDENTÁRIO",
      desc: "25-35 anos • Trabalho desk • Renda: R$ 4-12k • Foco: Saúde",
      dores: "Principais dores: Sedentarismo, postura, disposição",
    },
    {
      id: "jovem-adulta",
      title: "💃 JOVEM ADULTA",
      desc: "18-28 anos • Solteira • Renda: R$ 2-6k • Foco: Estética",
      dores: "Principais dores: Autoestima, padrões sociais, orçamento",
    },
  ],
  dinheiro: [
    {
      id: "empreendedor-iniciante",
      title: "🚀 EMPREENDEDOR INICIANTE",
      desc: "25-35 anos • Começando • Renda: R$ 3-10k • Foco: Crescimento",
      dores: "Principais dores: Falta de capital, conhecimento, rede de contatos",
    },
    {
      id: "profissional-liberal",
      title: "👨‍💼 PROFISSIONAL LIBERAL",
      desc: "30-45 anos • Estável • Renda: R$ 8-25k • Foco: Investimentos",
      dores: "Principais dores: Diversificação, tempo, conhecimento financeiro",
    },
    {
      id: "jovem-investidor",
      title: "📱 JOVEM INVESTIDOR",
      desc: "20-30 anos • Tech-savvy • Renda: R$ 4-12k • Foco: Renda passiva",
      dores: "Principais dores: Falta de experiência, medo de perder dinheiro",
    },
    {
      id: "aposentado-planejando",
      title: "👴 PLANEJANDO APOSENTADORIA",
      desc: "45-60 anos • Preparação • Renda: R$ 10-30k • Foco: Segurança",
      dores: "Principais dores: Insegurança financeira, inflação, reservas",
    },
  ],
  educacao: [
    {
      id: "estudante-vestibular",
      title: "🎓 ESTUDANTE VESTIBULAR",
      desc: "16-20 anos • Focado • Renda familiar: R$ 5-15k • Foco: Aprovação",
      dores: "Principais dores: Ansiedade, competição, pressão familiar",
    },
    {
      id: "profissional-qualificacao",
      title: "💼 BUSCANDO QUALIFICAÇÃO",
      desc: "25-40 anos • Carreira • Renda: R$ 4-15k • Foco: Promoção",
      dores: "Principais dores: Falta de tempo, custos, aplicação prática",
    },
    {
      id: "concurseiro",
      title: "📚 CONCURSEIRO",
      desc: "22-35 anos • Determinado • Renda: R$ 2-8k • Foco: Estabilidade",
      dores: "Principais dores: Constância, motivação, material atualizado",
    },
    {
      id: "mudanca-carreira",
      title: "🔄 MUDANÇA DE CARREIRA",
      desc: "30-50 anos • Transição • Renda: R$ 6-20k • Foco: Reinvenção",
      dores: "Principais dores: Incerteza, idade, competitividade",
    },
  ],
  business: [
    {
      id: "ceo-pequena-empresa",
      title: "🏢 CEO PEQUENA EMPRESA",
      desc: "30-50 anos • Liderança • Renda: R$ 15-50k • Foco: Crescimento",
      dores: "Principais dores: Gestão, escalabilidade, competitividade",
    },
    {
      id: "freelancer-escalando",
      title: "💻 FREELANCER ESCALANDO",
      desc: "25-40 anos • Independente • Renda: R$ 8-25k • Foco: Sistemas",
      dores: "Principais dores: Inconsistência, precificação, processos",
    },
    {
      id: "consultor-especialista",
      title: "🎯 CONSULTOR ESPECIALISTA",
      desc: "35-55 anos • Expert • Renda: R$ 20-80k • Foco: Posicionamento",
      dores: "Principais dores: Captação, diferenciação, escala",
    },
    {
      id: "startup-founder",
      title: "🚀 FOUNDER STARTUP",
      desc: "25-40 anos • Inovador • Renda: Variável • Foco: Crescimento",
      dores: "Principais dores: Funding, validação, market-fit",
    },
  ],
  relacionamentos: [
    {
      id: "jovem-solteiro",
      title: "💕 JOVEM SOLTEIRO",
      desc: "20-30 anos • Buscando • Renda: R$ 3-10k • Foco: Relacionamento",
      dores: "Principais dores: Timidez, rejeição, autoconfiança",
    },
    {
      id: "recem-separado",
      title: "💔 RECÉM SEPARADO",
      desc: "30-50 anos • Recomeço • Renda: R$ 5-20k • Foco: Superação",
      dores: "Principais dores: Autoestima, confiança, solidão",
    },
    {
      id: "casal-crise",
      title: "👫 CASAL EM CRISE",
      desc: "25-45 anos • Relacionamento • Renda: R$ 8-25k • Foco: Reconciliação",
      dores: "Principais dores: Comunicação, rotina, conexão",
    },
  ],
  casa: [
    {
      id: "nova-casa",
      title: "🏠 NOVA CASA",
      desc: "25-40 anos • Primeiro imóvel • Renda: R$ 6-20k • Foco: Organização",
      dores: "Principais dores: Decoração, orçamento, funcionalidade",
    },
    {
      id: "familia-crescendo",
      title: "👨‍👩‍👧‍👦 FAMÍLIA CRESCENDO",
      desc: "28-45 anos • Filhos • Renda: R$ 8-25k • Foco: Praticidade",
      dores: "Principais dores: Espaço, organização, segurança",
    },
  ],
  arte: [
    {
      id: "artista-iniciante",
      title: "🎨 ARTISTA INICIANTE",
      desc: "18-35 anos • Criativo • Renda: R$ 2-8k • Foco: Técnica",
      dores: "Principais dores: Técnica, inspiração, monetização",
    },
    {
      id: "designer-freelancer",
      title: "🖌️ DESIGNER FREELANCER",
      desc: "22-40 anos • Profissional • Renda: R$ 4-15k • Foco: Portfolio",
      dores: "Principais dores: Clientes, precificação, criatividade",
    },
  ],
  tech: [
    {
      id: "dev-junior",
      title: "👨‍💻 DEV JUNIOR",
      desc: "20-30 anos • Aprendendo • Renda: R$ 3-12k • Foco: Habilidades",
      dores: "Principais dores: Conhecimento, primeiro emprego, síndrome do impostor",
    },
    {
      id: "tech-lead",
      title: "🚀 TECH LEAD",
      desc: "28-45 anos • Liderança • Renda: R$ 15-40k • Foco: Gestão",
      dores: "Principais dores: Liderança técnica, deadlines, equipe",
    },
  ],
};

const FAIXAS_PRECO = [
  {
    id: "basico",
    label: "💵 BÁSICO",
    range: "Até R$ 97",
    tipo: "Produto simples",
  },
  {
    id: "intermediario",
    label: "💎 INTERMEDIÁRIO",
    range: "R$ 98-497",
    tipo: "Curso completo",
  },
  {
    id: "premium",
    label: "👑 PREMIUM",
    range: "R$ 498-1.997",
    tipo: "Mentoria grupo",
  },
  {
    id: "exclusivo",
    label: "🏆 EXCLUSIVO",
    range: "R$ 1.998+",
    tipo: "Consultoria 1:1",
  },
];

const DIFERENCIAIS = [
  {
    id: "velocidade",
    label: "⚡ VELOCIDADE",
    desc: "Resultados mais rápidos que a concorrência",
  },
  { id: "preco", label: "💰 PREÇO", desc: "Melhor custo-benefício do mercado" },
  { id: "metodo", label: "🎯 MÉTODO", desc: "Sistema exclusivo e comprovado" },
  {
    id: "autoridade",
    label: "👨‍⚕️ AUTORIDADE",
    desc: "Especialista reconhecido no nicho",
  },
  {
    id: "suporte",
    label: "🤝 SUPORTE",
    desc: "Atendimento personalizado 24/7",
  },
  { id: "garantia", label: "🏆 GARANTIA", desc: "Risco zero para o cliente" },
  {
    id: "comunidade",
    label: "👥 COMUNIDADE",
    desc: "Networking e grupo de apoio",
  },
  {
    id: "personalizacao",
    label: "🔧 PERSONALIZAÇÃO",
    desc: "Adaptado para cada cliente",
  },
];

const NIVEIS_MARKETING = [
  { id: "iniciante", label: "👶 Iniciante", desc: "menos de 6 meses" },
  { id: "basico", label: "📈 Básico", desc: "6 meses - 1 ano" },
  { id: "intermediario", label: "🎯 Intermediário", desc: "1-2 anos" },
  { id: "avancado", label: "🏆 Avançado", desc: "2+ anos" },
];

const NIVEIS_COPY = [
  { id: "nunca", label: "❓ Nunca escrevi copy profissional" },
  { id: "tentei", label: "📝 Já tentei, mas sem estrutura" },
  { id: "basico", label: "📋 Conheço alguns frameworks básicos" },
  { id: "resultados", label: "🎯 Já tive bons resultados com copy" },
];

const FATURAMENTO_ATUAL = [
  {
    id: "comecando",
    label: "💡 COMEÇANDO",
    range: "Até R$ 5k",
    stage: "Validando ideia",
  },
  {
    id: "crescendo",
    label: "📈 CRESCENDO",
    range: "R$ 5k-20k",
    stage: "Otimizando vendas",
  },
  {
    id: "escalando",
    label: "🚀 ESCALANDO",
    range: "R$ 20k-100k",
    stage: "Sistematizando processos",
  },
  {
    id: "expert",
    label: "👑 EXPERT",
    range: "R$ 100k+",
    stage: "Expandindo mercados",
  },
];

const DESAFIOS = [
  { id: "trafego", label: "🌐 Gerar tráfego qualificado" },
  { id: "conversao", label: "🔄 Converter visitantes em leads" },
  { id: "nutricao", label: "📧 Nutrir leads adequadamente" },
  { id: "vendas", label: "💰 Fechar mais vendas" },
  { id: "retencao", label: "🔁 Reter e fidelizar clientes" },
  { id: "conteudo", label: "✍️ Criar conteúdo persuasivo" },
  { id: "posicionamento", label: "🎯 Definir posicionamento claro" },
];

const SUGESTOES_NOMES = {
  fitness: [
    "Projeto Emagrecimento Express",
    "Método Corpo Ideal",
    "Transformação 60 Dias",
  ],
  dinheiro: [
    "Método Investidor Inteligente",
    "Renda Extra Digital",
    "Milhionário em 12 Meses",
  ],
  educacao: [
    "Curso Fluência Rápida",
    "Método Aprovação Concurso",
    "Master Class Premium",
  ],
  business: [
    "Empreendedor Digital Pro",
    "Negócio Lucrativo Online",
    "CEO Transformation",
  ],
};

export default function ProjetoFormOtimizado({
  mode,
  initialData,
  projectId,
  onSubmit,
  onCancel,
}: ProjetoFormOtimizadoProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<ProjetoFormData>({
    nomeProjeto: "",
    nicho: "",
    modeloNegocio: "",
    publicoIdeal: "",
    faixaPreco: "",
    promessaPrincipal: "",
    diferencialCompetitivo: [],
    nivelMarketingDigital: "",
    nivelCopywriting: "",
    faturamentoAtual: "",
    principalDesafio: "",
    ...initialData,
  });

  // Sugestões automáticas baseadas no que o usuário digita
  const [nomeSugestoes, setNomeSugestoes] = useState<string[]>([]);

  useEffect(() => {
    if (formData.nomeProjeto.length > 3) {
      const palavrasChave = formData.nomeProjeto.toLowerCase();
      let sugestoes: string[] = [];

      Object.entries(SUGESTOES_NOMES).forEach(([nicho, nomes]) => {
        if (
          palavrasChave.includes(nicho) ||
          (nicho === "fitness" &&
            (palavrasChave.includes("fitness") ||
              palavrasChave.includes("academia") ||
              palavrasChave.includes("emagre"))) ||
          (nicho === "dinheiro" &&
            (palavrasChave.includes("invest") ||
              palavrasChave.includes("dinheiro") ||
              palavrasChave.includes("renda"))) ||
          (nicho === "educacao" &&
            (palavrasChave.includes("curso") ||
              palavrasChave.includes("aprend") ||
              palavrasChave.includes("ensino"))) ||
          (nicho === "business" &&
            (palavrasChave.includes("negocio") ||
              palavrasChave.includes("empresa") ||
              palavrasChave.includes("empreend")))
        ) {
          sugestoes = [...sugestoes, ...nomes];
        }
      });

      setNomeSugestoes(sugestoes.slice(0, 3));
    } else {
      setNomeSugestoes([]);
    }
  }, [formData.nomeProjeto]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(formData);
      // Para criação de projetos, mostrar tela de sucesso
      if (mode === "create") {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof ProjetoFormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Se o nicho foi alterado, limpar o público ideal para forçar nova seleção
      if (field === 'nicho' && prev.nicho !== value) {
        newData.publicoIdeal = '';
      }
      
      return newData;
    });
  };

  const toggleDiferencial = (id: string) => {
    setFormData(prev => ({
      ...prev,
      diferencialCompetitivo: prev.diferencialCompetitivo.includes(id)
        ? prev.diferencialCompetitivo.filter(item => item !== id)
        : prev.diferencialCompetitivo.length < 2
          ? [...prev.diferencialCompetitivo, id]
          : prev.diferencialCompetitivo,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.nomeProjeto.trim();
      case 2:
        return !!(formData.nicho && formData.modeloNegocio);
      case 3:
        return !!(formData.publicoIdeal && formData.faixaPreco);
      case 4:
        return !!(
          formData.promessaPrincipal.trim() &&
          formData.diferencialCompetitivo.length > 0
        );
      case 5:
        return !!(
          formData.nivelMarketingDigital &&
          formData.nivelCopywriting &&
          formData.faturamentoAtual &&
          formData.principalDesafio
        );
      default:
        return false;
    }
  };

  const getProgressPercentage = () => {
    return Math.round((currentStep / 5) * 100);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          🏷️ COMO VAMOS CHAMAR SEU PROJETO?
        </h2>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Digite o nome do seu projeto"
          value={formData.nomeProjeto}
          onChange={e => updateFormData("nomeProjeto", e.target.value)}
          maxLength={50}
          className="h-14 text-center text-lg"
        />

        <p className="text-center text-sm text-gray-500">
          Ex: Projeto Mulher Fitness, Curso de Inglês Premium
        </p>

        <div className="text-center text-xs text-gray-400">
          {formData.nomeProjeto.length}/50 caracteres
        </div>

        {nomeSugestoes.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-gray-700">
              🎯 Sugestões baseadas no que você digitou:
            </p>
            <div className="space-y-2">
              {nomeSugestoes.map((sugestao, index) => (
                <button
                  key={index}
                  onClick={() => updateFormData("nomeProjeto", sugestao)}
                  className="w-full rounded-lg border border-blue-200 bg-blue-50 p-3 text-left text-sm text-blue-700 transition-colors hover:bg-blue-100"
                >
                  • {sugestao}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-700">
          💡 <strong>Dica:</strong> Use um nome que identifique facilmente seu
          produto
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          🎯 QUAL SEU NICHO DE ATUAÇÃO?
        </h2>
        <p className="text-gray-600">
          Escolha a categoria que melhor descreve seu negócio:
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {NICHOS.map(nicho => {
          const Icon = nicho.icon;
          return (
            <button
              key={nicho.id}
              onClick={() => updateFormData("nicho", nicho.id)}
              className={`rounded-xl border-2 p-4 text-center transition-all ${
                formData.nicho === nicho.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <Icon className="mx-auto mb-2 h-8 w-8 text-gray-600" />
              <div className="mb-1 text-xs font-bold text-gray-900">
                {nicho.label.split(" & ")[0]}
              </div>
              <div className="mb-2 text-xs font-bold text-gray-900">
                {nicho.label.split(" & ")[1]}
              </div>
              <Badge variant="secondary" className="text-xs">
                {nicho.trend}
              </Badge>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          🎯 MODELO DE NEGÓCIO
        </h3>
        <div className="space-y-3">
          {MODELOS_NEGOCIO.map(modelo => (
            <button
              key={modelo.id}
              onClick={() => updateFormData("modeloNegocio", modelo.id)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                formData.modeloNegocio === modelo.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{modelo.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">
                    {modelo.label}
                  </div>
                  {modelo.desc && (
                    <div className="text-sm text-gray-600">{modelo.desc}</div>
                  )}
                </div>
                {formData.modeloNegocio === modelo.id && (
                  <Check className="ml-auto h-5 w-5 text-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const nichoLabel = NICHOS.find(n => n.id === formData.nicho)?.label || formData.nicho;
    const personasDoNicho = PERSONAS_POR_NICHO[formData.nicho as keyof typeof PERSONAS_POR_NICHO] || [];

    return (
      <div className="space-y-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            👥 QUEM É SEU PÚBLICO IDEAL?
          </h2>
          {formData.nicho && personasDoNicho.length > 0 && (
            <p className="text-gray-600">
              Baseado em "{nichoLabel}", selecione sua persona principal:
            </p>
          )}
        </div>

        {formData.nicho && personasDoNicho.length > 0 ? (
          <div className="space-y-4">
            {personasDoNicho.map(persona => (
              <button
                key={persona.id}
                onClick={() => updateFormData("publicoIdeal", persona.id)}
                className={`w-full rounded-lg border-2 p-6 text-left transition-all ${
                  formData.publicoIdeal === persona.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-1 font-bold text-gray-900">
                      {persona.title}
                    </div>
                    <div className="mb-2 text-sm text-gray-600">
                      {persona.desc}
                    </div>
                    <div className="text-sm text-gray-500">{persona.dores}</div>
                  </div>
                  {formData.publicoIdeal === persona.id && (
                    <Check className="mt-1 h-5 w-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : formData.nicho ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-gray-600 mb-4">
              📝 Para este nicho, selecione um público-alvo geral:
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                { id: "jovem-adulto", label: "👨‍💻 Jovem Adulto (20-35 anos)" },
                { id: "profissional-experiente", label: "👩‍💼 Profissional Experiente (35-50 anos)" },
                { id: "empreendedor", label: "🚀 Empreendedor (25-45 anos)" },
                { id: "publico-geral", label: "👥 Público Geral (18-60 anos)" },
              ].map(opcao => (
                <button
                  key={opcao.id}
                  onClick={() => updateFormData("publicoIdeal", opcao.id)}
                  className={`rounded-lg border-2 p-4 text-center transition-all ${
                    formData.publicoIdeal === opcao.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">{opcao.label}</div>
                  {formData.publicoIdeal === opcao.id && (
                    <Check className="mt-2 mx-auto h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
            <p className="text-yellow-700">
              ⚠️ Primeiro selecione um nicho no passo anterior para ver as opções de público-alvo.
            </p>
          </div>
        )}

        <div className="mt-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            💰 FAIXA DE PREÇO DO SEU PRODUTO
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {FAIXAS_PRECO.map(faixa => (
              <button
                key={faixa.id}
                onClick={() => updateFormData("faixaPreco", faixa.id)}
                className={`rounded-lg border-2 p-4 text-center transition-all ${
                  formData.faixaPreco === faixa.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="mb-1 font-bold text-gray-900">{faixa.label}</div>
                <div className="mb-1 text-sm text-gray-600">{faixa.range}</div>
                <div className="text-xs text-gray-500">{faixa.tipo}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          🎁 QUAL SUA PROMESSA PRINCIPAL?
        </h2>
        <p className="text-gray-600">
          Digite o benefício específico que seu produto entrega:
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="Digite sua promessa única"
          value={formData.promessaPrincipal}
          onChange={e => updateFormData("promessaPrincipal", e.target.value)}
          maxLength={80}
          className="h-20 text-center"
        />
        <div className="text-center text-xs text-gray-400">
          {formData.promessaPrincipal.length}/80 caracteres
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <h4 className="mb-3 font-bold text-amber-800">
          ✨ EXEMPLOS PODEROSOS:
        </h4>
        <div className="space-y-2 text-sm text-amber-700">
          <p>• "Perca 10kg em 60 dias sem dieta restritiva"</p>
          <p>• "Fale inglês fluente em 6 meses com 20min/dia"</p>
          <p>• "Gere R$ 10k/mês com marketing digital em 90 dias"</p>
          <p>• "Conquiste seu ex em 21 dias com método comprovado"</p>
        </div>
        <div className="mt-4 rounded bg-amber-100 p-3 text-sm text-amber-800">
          💡 <strong>FÓRMULA VENCEDORA:</strong>
          <br />
          [Resultado específico] + [Prazo definido] + [Método único]
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          🔥 SEU DIFERENCIAL COMPETITIVO
        </h3>
        <p className="mb-4 text-gray-600">
          Marque até 2 opções que mais se destacam:
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {DIFERENCIAIS.map(diferencial => (
            <button
              key={diferencial.id}
              onClick={() => toggleDiferencial(diferencial.id)}
              disabled={
                formData.diferencialCompetitivo.length >= 2 &&
                !formData.diferencialCompetitivo.includes(diferencial.id)
              }
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                formData.diferencialCompetitivo.includes(diferencial.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              } ${
                formData.diferencialCompetitivo.length >= 2 &&
                !formData.diferencialCompetitivo.includes(diferencial.id)
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 font-semibold text-gray-900">
                    {diferencial.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {diferencial.desc}
                  </div>
                </div>
                {formData.diferencialCompetitivo.includes(diferencial.id) && (
                  <Check className="mt-1 h-5 w-5 text-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Selecionados: {formData.diferencialCompetitivo.length}/2
        </p>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          📊 SEU NÍVEL DE EXPERIÊNCIA
        </h2>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          🎯 Marketing Digital:
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {NIVEIS_MARKETING.map(nivel => (
            <button
              key={nivel.id}
              onClick={() => updateFormData("nivelMarketingDigital", nivel.id)}
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                formData.nivelMarketingDigital === nivel.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="mb-1 font-semibold text-gray-900">
                {nivel.label}
              </div>
              <div className="text-xs text-gray-600">{nivel.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          ✍️ Copywriting:
        </h3>
        <div className="space-y-3">
          {NIVEIS_COPY.map(nivel => (
            <button
              key={nivel.id}
              onClick={() => updateFormData("nivelCopywriting", nivel.id)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                formData.nivelCopywriting === nivel.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{nivel.label}</span>
                {formData.nivelCopywriting === nivel.id && (
                  <Check className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          📈 FATURAMENTO ATUAL
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {FATURAMENTO_ATUAL.map(faturamento => (
            <button
              key={faturamento.id}
              onClick={() => updateFormData("faturamentoAtual", faturamento.id)}
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                formData.faturamentoAtual === faturamento.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="mb-1 font-bold text-gray-900">
                {faturamento.label}
              </div>
              <div className="mb-1 text-sm text-gray-600">
                {faturamento.range}
              </div>
              <div className="text-xs text-gray-500">{faturamento.stage}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          🎯 PRINCIPAL DESAFIO ATUAL
        </h3>
        <div className="space-y-3">
          {DESAFIOS.map(desafio => (
            <button
              key={desafio.id}
              onClick={() => updateFormData("principalDesafio", desafio.id)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                formData.principalDesafio === desafio.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{desafio.label}</span>
                {formData.principalDesafio === desafio.id && (
                  <Check className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="py-12 text-center">
      <div className="mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">
          ⚡ Criando seu projeto personalizado...
        </h3>
      </div>

      <div className="mx-auto max-w-md space-y-3">
        <div className="flex items-center gap-3 text-left">
          <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
          <span className="text-green-700">
            Analisando perfil: {formData.publicoIdeal}, {formData.nicho},{" "}
            {formData.faixaPreco}
          </span>
        </div>
        <div className="flex items-center gap-3 text-left">
          <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
          <span className="text-green-700">
            Configurando templates para seu nicho...
          </span>
        </div>
        <div className="flex items-center gap-3 text-left">
          <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
          <span className="text-green-700">
            Personalizando linguagem para seu público...
          </span>
        </div>
        <div className="flex items-center gap-3 text-left">
          <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
          <span className="text-green-700">
            Preparando geradores de copy otimizados...
          </span>
        </div>
        <div className="flex items-center gap-3 text-left">
          <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin text-blue-600" />
          <span className="text-blue-700">
            Criando dashboard personalizado...
          </span>
        </div>
      </div>

      <div className="mt-8">
        <div className="mx-auto h-3 w-full max-w-md rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all duration-1000"
            style={{ width: "95%" }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">95%</p>
      </div>

      <p className="mx-auto mt-6 max-w-md text-gray-600">
        🎯 Quase pronto! Em segundos você terá acesso a copies personalizadas
        para sua audiência específica.
      </p>
    </div>
  );

  const isCurrentStepValid = validateStep(currentStep);

  // Mostrar tela de sucesso após criar projeto
  if (showSuccess) {
    return (
      <ProjetoSucesso
        projeto={{
          nome: formData.nomeProjeto,
          nicho: formData.nicho,
          publicoIdeal: formData.publicoIdeal,
          faixaPreco: formData.faixaPreco,
          promessa: formData.promessaPrincipal,
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-6">
          <Card>
            <CardContent className="p-8">{renderProcessing()}</CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header com Progress */}
        <div className="mb-8 text-center">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              🚀 Vamos criar seu projeto em 3 minutos
            </h1>
            <div className="mb-4 flex items-center justify-center gap-4">
              <div className="h-2 flex-1 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {getProgressPercentage()}% concluído
              </span>
            </div>
            <p className="text-gray-600">Passo {currentStep}/5</p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              PASSO {currentStep}/5:{" "}
              {currentStep === 1
                ? "IDENTIDADE DO PROJETO ⏱️ 30s"
                : currentStep === 2
                  ? "NICHO E MODELO ⏱️ 45s"
                  : currentStep === 3
                    ? "PÚBLICO E PREÇO ⏱️ 60s"
                    : currentStep === 4
                      ? "PROMESSA E DIFERENCIAL ⏱️ 90s"
                      : "VALIDAÇÃO E EXPERIÊNCIA ⏱️ 60s"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : handlePrev}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 1 ? "Cancelar" : "Voltar"}
          </Button>

          {currentStep === 5 ? (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentStepValid || isLoading}
              size="lg"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {mode === "create" ? "Criar Meu Projeto" : "Salvar Alterações"} 🚀
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              size="lg"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
