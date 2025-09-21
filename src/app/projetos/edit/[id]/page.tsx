"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { ArrowLeft, Loader2, Trash2 } from "lucide-react";

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

interface Projeto {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  criativos: number;
  status: "ativo" | "pausado" | "arquivado";
  modeloNegocio: string;
  metaFaturamento: string;
}

interface EditProjectData {
  name: string;
  description: string;
  modeloNegocio: string;
  metaFaturamento: string;
  status: "ativo" | "pausado" | "arquivado";
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [formData, setFormData] = useState<EditProjectData>({
    name: "",
    description: "",
    modeloNegocio: "",
    metaFaturamento: "",
    status: "ativo",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Load project data (mock data)
    const mockProjetos: Projeto[] = [
      {
        id: "1",
        name: "Curso de Inglês Online",
        description: "Curso completo de inglês para iniciantes",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
        criativos: 5,
        status: "ativo",
        modeloNegocio: "infoprodutos",
        metaFaturamento: "10k-50k",
      },
      {
        id: "2",
        name: "E-commerce de Roupas",
        description: "Loja virtual de moda feminina",
        createdAt: "2024-01-10",
        updatedAt: "2024-01-18",
        criativos: 3,
        status: "ativo",
        modeloNegocio: "ecommerce",
        metaFaturamento: "50k-100k",
      },
      {
        id: "3",
        name: "Consultoria Empresarial",
        description: "Serviços de consultoria para PMEs",
        createdAt: "2024-01-05",
        updatedAt: "2024-01-12",
        criativos: 2,
        status: "pausado",
        modeloNegocio: "servicos",
        metaFaturamento: "100k-300k",
      },
    ];

    const foundProject = mockProjetos.find(p => p.id === projectId);
    if (!foundProject) {
      router.push("/projetos");
      return;
    }

    setProjeto(foundProject);
    setFormData({
      name: foundProject.name,
      description: foundProject.description || "",
      modeloNegocio: foundProject.modeloNegocio,
      metaFaturamento: foundProject.metaFaturamento,
      status: foundProject.status,
    });
  }, [projectId, router]);

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

      // Update project
      const updatedProject = {
        ...projeto!,
        name: formData.name,
        description: formData.description,
        modeloNegocio: formData.modeloNegocio,
        metaFaturamento: formData.metaFaturamento,
        status: formData.status,
        updatedAt: new Date().toISOString(),
      };

      // Update current project if it's the one being edited
      const currentProject = localStorage.getItem("currentProject");
      if (currentProject) {
        const current = JSON.parse(currentProject);
        if (current.id === projectId) {
          localStorage.setItem(
            "currentProject",
            JSON.stringify(updatedProject)
          );
        }
      }

      router.push("/projetos");
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      setErrors({ general: "Erro ao atualizar projeto. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(`Tem certeza que deseja excluir o projeto "${projeto?.name}"?`)
    ) {
      return;
    }

    if (
      !confirm(
        "Esta ação não pode ser desfeita. Todos os criativos associados também serão excluídos."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear current project if it's the one being deleted
      const currentProject = localStorage.getItem("currentProject");
      if (currentProject) {
        const current = JSON.parse(currentProject);
        if (current.id === projectId) {
          localStorage.removeItem("currentProject");
        }
      }

      router.push("/projetos");
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      setErrors({ general: "Erro ao excluir projeto. Tente novamente." });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push("/projetos");
  };

  if (!projeto) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Editar Projeto</h1>
          <p className="text-gray-600">
            Atualize as informações do seu projeto
          </p>
        </div>
      </div>

      {/* Project Info */}
      <Card className="mb-6 border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <strong>Criado em:</strong>{" "}
              {new Date(projeto.createdAt).toLocaleDateString("pt-BR")}
            </div>
            <div>
              <strong>{projeto.criativos}</strong> criativo(s)
            </div>
          </div>
        </CardContent>
      </Card>

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
              <Label htmlFor="description">Descrição</Label>
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
              <Label>Status do Projeto</Label>
              <Select
                value={formData.status}
                onValueChange={value =>
                  setFormData(prev => ({
                    ...prev,
                    status: value as "ativo" | "pausado" | "arquivado",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="pausado">Pausado</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
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
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading || isDeleting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || isDeleting}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>

              {/* Delete Button */}
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading || isDeleting}
                className="flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Excluir Projeto
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
