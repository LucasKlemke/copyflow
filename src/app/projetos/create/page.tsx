"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, Loader2 } from "lucide-react";

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

interface CreateProjectData {
  name: string;
  description: string;
  modeloNegocio: string;
  metaFaturamento: string;
  status: "ativo" | "pausado";
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProjectData>({
    name: "",
    description: "",
    modeloNegocio: "",
    metaFaturamento: "",
    status: "ativo",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome do projeto é obrigatório";
    } else if (formData.name.length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.modeloNegocio) {
      newErrors.modeloNegocio = "Modelo de negócio é obrigatório";
    }

    if (!formData.metaFaturamento) {
      newErrors.metaFaturamento = "Meta de faturamento é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create new project
      const newProject = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        criativos: 0,
        status: formData.status,
        modeloNegocio: formData.modeloNegocio,
        metaFaturamento: formData.metaFaturamento,
        onboardingData: {
          nomeProduto: formData.name,
          modeloNegocio: formData.modeloNegocio,
          metaFaturamento: formData.metaFaturamento,
        },
      };

      // Save as current project
      localStorage.setItem("currentProject", JSON.stringify(newProject));

      // Redirect to onboarding for complete setup
      router.push("/onboarding");
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      setErrors({ general: "Erro ao criar projeto. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/projetos");
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/projetos")}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Criar Novo Projeto
          </h1>
          <p className="text-gray-600">
            Configure as informações básicas do seu projeto
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Projeto *</Label>
              <Input
                id="name"
                placeholder="Ex: Curso de Inglês Online"
                value={formData.name}
                onChange={e =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descreva brevemente seu projeto..."
                value={formData.description}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            {/* Business Model */}
            <div className="space-y-2">
              <Label>Modelo de Negócio *</Label>
              <Select
                value={formData.modeloNegocio}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, modeloNegocio: value }))
                }
              >
                <SelectTrigger
                  className={errors.modeloNegocio ? "border-red-500" : ""}
                >
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
              {errors.modeloNegocio && (
                <p className="text-sm text-red-600">{errors.modeloNegocio}</p>
              )}
            </div>

            {/* Revenue Goal */}
            <div className="space-y-2">
              <Label>Meta de Faturamento Mensal *</Label>
              <Select
                value={formData.metaFaturamento}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, metaFaturamento: value }))
                }
              >
                <SelectTrigger
                  className={errors.metaFaturamento ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecione sua meta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate-10k">Até R$ 10.000</SelectItem>
                  <SelectItem value="10k-50k">R$ 10.001 - R$ 50.000</SelectItem>
                  <SelectItem value="50k-100k">
                    R$ 50.001 - R$ 100.000
                  </SelectItem>
                  <SelectItem value="100k-300k">
                    R$ 100.001 - R$ 300.000
                  </SelectItem>
                  <SelectItem value="300k-500k">
                    R$ 300.001 - R$ 500.000
                  </SelectItem>
                  <SelectItem value="acima-500k">
                    Acima de R$ 500.000
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.metaFaturamento && (
                <p className="text-sm text-red-600">{errors.metaFaturamento}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status Inicial</Label>
              <Select
                value={formData.status}
                onValueChange={value =>
                  setFormData(prev => ({
                    ...prev,
                    status: value as "ativo" | "pausado",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="pausado">Pausado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="text-center text-sm text-red-600">
                {errors.general}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Projeto"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <p className="text-sm text-blue-700">
            <strong>Próximo passo:</strong> Após criar o projeto, você será
            direcionado para o formulário de onboarding completo para configurar
            todos os detalhes do seu negócio e público-alvo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
