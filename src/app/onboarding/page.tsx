"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface OnboardingData {
  // Seção 1: Informações do Negócio
  nomeProduto: string;
  modeloNegocio: string;
  faixaPreco: string;

  // Seção 2: Público-Alvo
  generoPublico: string;
  faixaEtaria: string;
  nivelEscolaridade: string;
  classeSocial: string;
  momentoPublico: string;

  // Seção 3: Posicionamento
  principalBeneficio: string;
  maiorDor: string;
  diferencialCompetitivo: string[];

  // Seção 4: Experiência e Objetivos
  tempoMarketingDigital: string;
  experienciaCopywriting: string;
  canalVendasAtual: string;
  maiorDesafio: string;
  metaFaturamento: string;

  // Seção 5: Preferências de Comunicação
  tomVoz: string;
  tiposCopy: string[];

  // Campos condicionais
  nichoAfiliado?: string;
  outroModeloNegocio?: string;
}

const STEPS = [
  {
    id: 1,
    title: "Informações do Negócio",
    subtitle: "Conte-nos sobre seu produto/serviço",
  },
  { id: 2, title: "Público-Alvo", subtitle: "Quem são seus clientes ideais?" },
  {
    id: 3,
    title: "Posicionamento",
    subtitle: "Como você se diferencia no mercado?",
  },
  {
    id: 4,
    title: "Experiência",
    subtitle: "Seu histórico no marketing digital",
  },
  {
    id: 5,
    title: "Preferências",
    subtitle: "Como você gosta de se comunicar?",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    nomeProduto: "",
    modeloNegocio: "",
    faixaPreco: "",
    generoPublico: "",
    faixaEtaria: "",
    nivelEscolaridade: "",
    classeSocial: "",
    momentoPublico: "",
    principalBeneficio: "",
    maiorDor: "",
    diferencialCompetitivo: [],
    tempoMarketingDigital: "",
    experienciaCopywriting: "",
    canalVendasAtual: "",
    maiorDesafio: "",
    metaFaturamento: "",
    tomVoz: "",
    tiposCopy: [],
  });

  const handleArrayFieldToggle = (
    field: keyof OnboardingData,
    value: string
  ) => {
    setFormData(prev => {
      const currentArray = (prev[field] as string[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.nomeProduto &&
          formData.modeloNegocio &&
          formData.faixaPreco
        );
      case 2:
        return !!(
          formData.generoPublico &&
          formData.faixaEtaria &&
          formData.nivelEscolaridade &&
          formData.classeSocial &&
          formData.momentoPublico
        );
      case 3:
        return !!(
          formData.principalBeneficio &&
          formData.maiorDor &&
          formData.diferencialCompetitivo.length > 0
        );
      case 4:
        return !!(
          formData.tempoMarketingDigital &&
          formData.experienciaCopywriting &&
          formData.canalVendasAtual &&
          formData.maiorDesafio &&
          formData.metaFaturamento
        );
      case 5:
        return !!(formData.tomVoz && formData.tiposCopy.length > 0);
      default:
        return false;
    }
  };

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save project data to localStorage for now
      const projectData = {
        id: Date.now().toString(),
        name: formData.nomeProduto,
        createdAt: new Date().toISOString(),
        onboardingData: formData,
      };

      localStorage.setItem("currentProject", JSON.stringify(projectData));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="nomeProduto">
          1. Nome do seu produto/serviço principal *
        </Label>
        <Input
          id="nomeProduto"
          placeholder="Ex: Curso de Inglês Online"
          value={formData.nomeProduto}
          onChange={e =>
            setFormData(prev => ({ ...prev, nomeProduto: e.target.value }))
          }
          maxLength={50}
          className="mt-2"
        />
        <p className="mt-1 text-xs text-gray-500">Máximo 50 caracteres</p>
      </div>

      <div>
        <Label>2. Qual o seu modelo de negócio? *</Label>
        <Select
          value={formData.modeloNegocio}
          onValueChange={value =>
            setFormData(prev => ({ ...prev, modeloNegocio: value }))
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecione seu modelo de negócio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="infoprodutos">
              Infoprodutos (Cursos, Ebooks, Mentorias)
            </SelectItem>
            <SelectItem value="ecommerce">
              E-commerce (Produtos físicos)
            </SelectItem>
            <SelectItem value="saas">SaaS/Software</SelectItem>
            <SelectItem value="servicos">Serviços/Consultoria</SelectItem>
            <SelectItem value="coaching">Coaching/Mentoria</SelectItem>
            <SelectItem value="afiliado">Afiliado/Revendedor</SelectItem>
            <SelectItem value="agencia">Agência de Marketing</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>

        {formData.modeloNegocio === "afiliado" && (
          <Input
            placeholder="Qual nicho promove?"
            value={formData.nichoAfiliado || ""}
            onChange={e =>
              setFormData(prev => ({ ...prev, nichoAfiliado: e.target.value }))
            }
            className="mt-2"
          />
        )}

        {formData.modeloNegocio === "outro" && (
          <Input
            placeholder="Especifique seu modelo de negócio"
            value={formData.outroModeloNegocio || ""}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                outroModeloNegocio: e.target.value,
              }))
            }
            className="mt-2"
          />
        )}
      </div>

      <div>
        <Label>3. Faixa de preço do seu produto principal *</Label>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            { value: "ate-97", label: "Até R$ 97" },
            { value: "98-497", label: "R$ 98 - R$ 497" },
            { value: "498-997", label: "R$ 498 - R$ 997" },
            { value: "998-2997", label: "R$ 998 - R$ 2.997" },
            { value: "2998-9997", label: "R$ 2.998 - R$ 9.997" },
            { value: "acima-10000", label: "Acima de R$ 10.000" },
          ].map(option => (
            <div
              key={option.value}
              className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-blue-300 ${
                formData.faixaPreco === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() =>
                setFormData(prev => ({ ...prev, faixaPreco: option.value }))
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {formData.faixaPreco === option.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label>4. Gênero do seu público principal *</Label>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            { value: "masculino", label: "Majoritariamente masculino (70%+)" },
            { value: "feminino", label: "Majoritariamente feminino (70%+)" },
            { value: "misto", label: "Misto/Equilibrado" },
            { value: "nao-sei", label: "Não sei" },
          ].map(option => (
            <div
              key={option.value}
              className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-blue-300 ${
                formData.generoPublico === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() =>
                setFormData(prev => ({ ...prev, generoPublico: option.value }))
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {formData.generoPublico === option.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>5. Faixa etária predominante *</Label>
        <Select
          value={formData.faixaEtaria}
          onValueChange={value =>
            setFormData(prev => ({ ...prev, faixaEtaria: value }))
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecione a faixa etária" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="18-24">18-24 anos</SelectItem>
            <SelectItem value="25-34">25-34 anos</SelectItem>
            <SelectItem value="35-44">35-44 anos</SelectItem>
            <SelectItem value="45-54">45-54 anos</SelectItem>
            <SelectItem value="55+">55+ anos</SelectItem>
            <SelectItem value="variado">Variado/Não sei</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>6. Nível de escolaridade do público *</Label>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            { value: "fundamental-medio", label: "Ensino fundamental/médio" },
            { value: "superior-incompleto", label: "Superior incompleto" },
            { value: "superior-completo", label: "Superior completo" },
            { value: "pos-graduacao", label: "Pós-graduação" },
            { value: "variado", label: "Variado/Não sei" },
          ].map(option => (
            <div
              key={option.value}
              className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-blue-300 ${
                formData.nivelEscolaridade === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() =>
                setFormData(prev => ({
                  ...prev,
                  nivelEscolaridade: option.value,
                }))
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {formData.nivelEscolaridade === option.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>7. Classe social predominante *</Label>
        <Select
          value={formData.classeSocial}
          onValueChange={value =>
            setFormData(prev => ({ ...prev, classeSocial: value }))
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecione a classe social" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classe-c">
              Classe C (R$ 2.000-5.000/mês)
            </SelectItem>
            <SelectItem value="classe-b">
              Classe B (R$ 5.000-15.000/mês)
            </SelectItem>
            <SelectItem value="classe-a">Classe A (R$ 15.000+/mês)</SelectItem>
            <SelectItem value="variado">Variado/Não sei</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>8. Seu público está em qual momento? *</Label>
        <div className="mt-2 space-y-2">
          {[
            {
              value: "nao-sabe-problema",
              label: "Não sabe que tem o problema",
            },
            {
              value: "sabe-nao-procura",
              label: "Sabe do problema, mas não procura solução",
            },
            {
              value: "procura-ativamente",
              label: "Procura soluções ativamente",
            },
            { value: "ja-testou", label: "Já testou outras soluções" },
            { value: "conhece-mercado", label: "Conhece bem o mercado" },
          ].map(option => (
            <div
              key={option.value}
              className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-blue-300 ${
                formData.momentoPublico === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() =>
                setFormData(prev => ({ ...prev, momentoPublico: option.value }))
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {formData.momentoPublico === option.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label>9. Principal benefício do seu produto *</Label>
        <Select
          value={formData.principalBeneficio}
          onValueChange={value =>
            setFormData(prev => ({ ...prev, principalBeneficio: value }))
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecione o principal benefício" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ganhar-dinheiro">
              Ganhar mais dinheiro
            </SelectItem>
            <SelectItem value="economizar-tempo">Economizar tempo</SelectItem>
            <SelectItem value="saude-bem-estar">
              Melhorar saúde/bem-estar
            </SelectItem>
            <SelectItem value="desenvolver-habilidades">
              Desenvolver habilidades
            </SelectItem>
            <SelectItem value="resolver-problema">
              Resolver problema específico
            </SelectItem>
            <SelectItem value="status-reconhecimento">
              Status/reconhecimento
            </SelectItem>
            <SelectItem value="relacionamentos">Relacionamentos</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="maiorDor">10. Maior dor/problema que resolve *</Label>
        <Textarea
          id="maiorDor"
          placeholder="Ex: Falta de tempo para exercitar-se"
          value={formData.maiorDor}
          onChange={e =>
            setFormData(prev => ({ ...prev, maiorDor: e.target.value }))
          }
          maxLength={100}
          className="mt-2"
        />
        <p className="mt-1 text-xs text-gray-500">Máximo 100 caracteres</p>
      </div>

      <div>
        <Label>11. Seu diferencial competitivo (escolha até 3) *</Label>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            { value: "preco-baixo", label: "Preço mais baixo" },
            {
              value: "rapidez-resultados",
              label: "Maior rapidez nos resultados",
            },
            { value: "metodo-exclusivo", label: "Método exclusivo/próprio" },
            { value: "suporte-personalizado", label: "Suporte personalizado" },
            { value: "garantia-estendida", label: "Garantia estendida" },
            {
              value: "experiencia-autoridade",
              label: "Experiência/autoridade",
            },
            { value: "tecnologia-avancada", label: "Tecnologia avançada" },
            { value: "comunidade-networking", label: "Comunidade/networking" },
          ].map(option => (
            <div
              key={option.value}
              className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-blue-300 ${
                formData.diferencialCompetitivo.includes(option.value)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => {
                if (formData.diferencialCompetitivo.includes(option.value)) {
                  handleArrayFieldToggle(
                    "diferencialCompetitivo",
                    option.value
                  );
                } else if (formData.diferencialCompetitivo.length < 3) {
                  handleArrayFieldToggle(
                    "diferencialCompetitivo",
                    option.value
                  );
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {formData.diferencialCompetitivo.includes(option.value) && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Selecionados: {formData.diferencialCompetitivo.length}/3
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <Label>12. Há quanto tempo está no marketing digital? *</Label>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            { value: "menos-6-meses", label: "Menos de 6 meses" },
            { value: "6-meses-1-ano", label: "6 meses - 1 ano" },
            { value: "1-2-anos", label: "1-2 anos" },
            { value: "3-5-anos", label: "3-5 anos" },
            { value: "mais-5-anos", label: "Mais de 5 anos" },
          ].map(option => (
            <div
              key={option.value}
              className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-blue-300 ${
                formData.tempoMarketingDigital === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() =>
                setFormData(prev => ({
                  ...prev,
                  tempoMarketingDigital: option.value,
                }))
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {formData.tempoMarketingDigital === option.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>13. Nível de experiência em copywriting *</Label>
        <div className="mt-2 space-y-2">
          {[
            { value: "iniciante", label: "Iniciante (nunca escrevi copy)" },
            { value: "basico", label: "Básico (já tentei, mas sem estrutura)" },
            {
              value: "intermediario",
              label: "Intermediário (conheço alguns frameworks)",
            },
            { value: "avancado", label: "Avançado (já tive bons resultados)" },
          ].map(option => (
            <div
              key={option.value}
              className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-blue-300 ${
                formData.experienciaCopywriting === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() =>
                setFormData(prev => ({
                  ...prev,
                  experienciaCopywriting: option.value,
                }))
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {formData.experienciaCopywriting === option.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>14. Principal canal de vendas atual *</Label>
        <Select
          value={formData.canalVendasAtual}
          onValueChange={value =>
            setFormData(prev => ({ ...prev, canalVendasAtual: value }))
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecione seu principal canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook-ads">Facebook/Meta Ads</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="email-marketing">Email marketing</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="site-blog">Site/Blog</SelectItem>
            <SelectItem value="indicacao">Indicação/Boca a boca</SelectItem>
            <SelectItem value="marketplace">
              Marketplace (Hotmart, Monetizze)
            </SelectItem>
            <SelectItem value="google-ads">Google Ads</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>15. Maior desafio atual no marketing *</Label>
        <div className="mt-2 space-y-2">
          {[
            { value: "gerar-trafego", label: "Gerar tráfego qualificado" },
            {
              value: "converter-visitantes",
              label: "Converter visitantes em leads",
            },
            { value: "nutrir-leads", label: "Nutrir leads adequadamente" },
            { value: "fechar-vendas", label: "Fechar vendas/conversão" },
            { value: "reter-clientes", label: "Reter/fidelizar clientes" },
            { value: "criar-conteudo", label: "Criar conteúdo persuasivo" },
            {
              value: "definir-posicionamento",
              label: "Definir posicionamento",
            },
          ].map(option => (
            <div
              key={option.value}
              className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-blue-300 ${
                formData.maiorDesafio === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() =>
                setFormData(prev => ({ ...prev, maiorDesafio: option.value }))
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {formData.maiorDesafio === option.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>16. Meta de faturamento mensal *</Label>
        <Select
          value={formData.metaFaturamento}
          onValueChange={value =>
            setFormData(prev => ({ ...prev, metaFaturamento: value }))
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecione sua meta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ate-10k">Até R$ 10.000</SelectItem>
            <SelectItem value="10k-50k">R$ 10.001 - R$ 50.000</SelectItem>
            <SelectItem value="50k-100k">R$ 50.001 - R$ 100.000</SelectItem>
            <SelectItem value="100k-300k">R$ 100.001 - R$ 300.000</SelectItem>
            <SelectItem value="300k-500k">R$ 300.001 - R$ 500.000</SelectItem>
            <SelectItem value="acima-500k">Acima de R$ 500.000</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <Label>17. Tom de voz preferido para sua comunicação *</Label>
        <div className="mt-2 space-y-2">
          {[
            { value: "formal", label: "Formal/Profissional" },
            { value: "amigavel", label: "Amigável/Próximo" },
            { value: "energico", label: "Enérgico/Motivacional" },
            { value: "tecnico", label: "Técnico/Especialista" },
            { value: "descontraido", label: "Descontraído/Divertido" },
          ].map(option => (
            <div
              key={option.value}
              className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-blue-300 ${
                formData.tomVoz === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() =>
                setFormData(prev => ({ ...prev, tomVoz: option.value }))
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {formData.tomVoz === option.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>18. Tipos de copy que mais precisa (selecione até 3) *</Label>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            { value: "sales-pages", label: "Sales pages/Páginas de vendas" },
            { value: "email-marketing", label: "Email marketing" },
            {
              value: "anuncios-pagos",
              label: "Anúncios pagos (Facebook/Google)",
            },
            { value: "posts-redes-sociais", label: "Posts para redes sociais" },
            { value: "scripts-vsl", label: "Scripts para VSL/vídeos" },
            { value: "funis-vendas", label: "Funis de vendas completos" },
            { value: "iscas-digitais", label: "Iscas digitais/Lead magnets" },
            { value: "webinars", label: "Webinars/Apresentações" },
          ].map(option => (
            <div
              key={option.value}
              className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-blue-300 ${
                formData.tiposCopy.includes(option.value)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => {
                if (formData.tiposCopy.includes(option.value)) {
                  handleArrayFieldToggle("tiposCopy", option.value);
                } else if (formData.tiposCopy.length < 3) {
                  handleArrayFieldToggle("tiposCopy", option.value);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {formData.tiposCopy.includes(option.value) && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Selecionados: {formData.tiposCopy.length}/3
        </p>
      </div>
    </div>
  );

  const isCurrentStepValid = validateStep(currentStep);
  const currentStepData = STEPS.find(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Configure seu Projeto
          </h1>
          <p className="mt-2 text-gray-600">
            Vamos conhecer melhor seu negócio para criar conteúdos mais
            assertivos
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    currentStep >= step.id
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 bg-white text-gray-300"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 w-24 ${
                      currentStep > step.id ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            {STEPS.map(step => (
              <div
                key={step.id}
                className="text-center"
                style={{ width: "20%" }}
              >
                <div className="font-medium">{step.title}</div>
                <div className="text-xs">{step.subtitle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentStepData?.title}</CardTitle>
            <p className="text-gray-600">{currentStepData?.subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-6">
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
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="text-sm text-gray-600">
            Etapa {currentStep} de {STEPS.length}
          </div>

          {currentStep === 5 ? (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentStepValid || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando projeto...
                </>
              ) : (
                <>
                  Finalizar
                  <Check className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              className="flex items-center gap-2"
            >
              Próximo
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
