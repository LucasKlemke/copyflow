"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Calendar,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Criativo {
  id: string;
  nome: string;
  tipo: "vsl" | "sales-page" | "email" | "anuncio";
  status: "rascunho" | "concluido" | "em-revisao";
  criadoEm: string;
  ultimaEdicao: string;
  thumbnail?: string;
}

interface Projeto {
  id: string;
  name: string;
  createdAt: string;
  onboardingData: any;
}

const CRIATIVO_TYPES = {
  vsl: { label: "VSL", icon: Video, color: "bg-blue-100 text-blue-600" },
  "sales-page": {
    label: "Sales Page",
    icon: FileText,
    color: "bg-green-100 text-green-600",
  },
  email: {
    label: "Email",
    icon: FileText,
    color: "bg-purple-100 text-purple-600",
  },
  anuncio: {
    label: "Anúncio",
    icon: FileText,
    color: "bg-yellow-100 text-yellow-600",
  },
};

const STATUS_LABELS = {
  rascunho: { label: "Rascunho", color: "bg-gray-100 text-gray-600" },
  "em-revisao": { label: "Em Revisão", color: "bg-yellow-100 text-yellow-600" },
  concluido: { label: "Concluído", color: "bg-green-100 text-green-600" },
};

export default function DashboardPage() {
  const router = useRouter();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [criativos, setCriativos] = useState<Criativo[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Load project data
    const currentProject = localStorage.getItem("currentProject");
    if (!currentProject) {
      router.push("/onboarding");
      return;
    }

    setProjeto(JSON.parse(currentProject));

    // Check for URL filters from sidebar
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get("filter");

    if (filter === "favoritos") {
      setFiltroStatus("concluido");
    } else if (filter === "rascunhos") {
      setFiltroStatus("rascunho");
    } else if (filter === "recentes") {
      // Sort by most recent - this would be handled in the filtering logic
      setSearchTerm("");
      setFiltroTipo("todos");
      setFiltroStatus("todos");
    }

    // Load criativos (mock data for now)
    const mockCriativos: Criativo[] = [
      {
        id: "1",
        nome: "VSL Principal - Curso de Inglês",
        tipo: "vsl",
        status: "concluido",
        criadoEm: "2024-01-15",
        ultimaEdicao: "2024-01-20",
      },
      {
        id: "2",
        nome: "Email de Boas-vindas",
        tipo: "email",
        status: "em-revisao",
        criadoEm: "2024-01-18",
        ultimaEdicao: "2024-01-19",
      },
      {
        id: "3",
        nome: "Anúncio Facebook - Captação",
        tipo: "anuncio",
        status: "rascunho",
        criadoEm: "2024-01-20",
        ultimaEdicao: "2024-01-20",
      },
    ];

    setCriativos(mockCriativos);
  }, [router]);

  const handleCreateCriativo = (tipo: string) => {
    const routes = {
      vsl: "/criativos/vsl/create",
      "sales-page": "/criativos/sales-page/create",
      email: "/criativos/email/create",
      anuncio: "/criativos/anuncio/create",
    };

    const route = routes[tipo as keyof typeof routes];
    if (route) {
      router.push(route);
    } else {
      alert(`Criação de ${tipo} será implementada em breve!`);
    }
  };

  const handleEditCriativo = (id: string) => {
    // For now, just show an alert
    alert(`Edição do criativo ${id} será implementada em breve!`);
  };

  const filteredCriativos = criativos.filter(criativo => {
    const matchesTipo = filtroTipo === "todos" || criativo.tipo === filtroTipo;
    const matchesStatus =
      filtroStatus === "todos" || criativo.status === filtroStatus;
    const matchesSearch = criativo.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTipo && matchesStatus && matchesSearch;
  });

  if (!projeto) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header do Projeto */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{projeto.name}</h1>
            <p className="mt-2 text-gray-600">
              Projeto criado em{" "}
              {new Date(projeto.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Configurações do Projeto
            </Button>
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-lg bg-blue-100 p-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total de Criativos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {criativos.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-lg bg-green-100 p-2">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {criativos.filter(c => c.status === "concluido").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-lg bg-yellow-100 p-2">
                <FileText className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Revisão</p>
                <p className="text-2xl font-bold text-gray-900">
                  {criativos.filter(c => c.status === "em-revisao").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-lg bg-gray-100 p-2">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rascunhos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {criativos.filter(c => c.status === "rascunho").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Criar Novo Criativo
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => router.push("/criativos")}
              className="flex items-center gap-2"
            >
              Ver Todos os Tipos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(CRIATIVO_TYPES).map(([tipo, config]) => {
              const IconComponent = config.icon;
              return (
                <Card
                  key={tipo}
                  className="cursor-pointer transition-all hover:scale-105 hover:shadow-md"
                  onClick={() => handleCreateCriativo(tipo)}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`inline-flex rounded-full p-3 ${config.color} mb-3`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-gray-900">
                      {config.label}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {tipo === "vsl" && "Scripts para vídeos de vendas"}
                      {tipo === "sales-page" && "Páginas de vendas persuasivas"}
                      {tipo === "email" && "Sequências de email marketing"}
                      {tipo === "anuncio" && "Anúncios para redes sociais"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filtros e Busca */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros:</span>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Input
            placeholder="Buscar criativos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="sm:w-64"
          />

          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              {Object.entries(CRIATIVO_TYPES).map(([tipo, config]) => (
                <SelectItem key={tipo} value={tipo}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {Object.entries(STATUS_LABELS).map(([status, config]) => (
                <SelectItem key={status} value={status}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Criativos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Meus Criativos ({filteredCriativos.length})
          </h2>
        </div>

        {filteredCriativos.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {criativos.length === 0
                  ? "Nenhum criativo criado ainda"
                  : "Nenhum criativo encontrado"}
              </h3>
              <p className="mb-6 text-gray-600">
                {criativos.length === 0
                  ? "Comece criando seu primeiro criativo para este projeto."
                  : "Tente ajustar os filtros ou termo de busca."}
              </p>
              {criativos.length === 0 && (
                <Button
                  onClick={() => handleCreateCriativo("vsl")}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Criar Primeira VSL
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCriativos.map(criativo => {
              const tipoConfig = CRIATIVO_TYPES[criativo.tipo];
              const statusConfig = STATUS_LABELS[criativo.status];
              const IconComponent = tipoConfig.icon;

              return (
                <Card
                  key={criativo.id}
                  className="group cursor-pointer transition-all hover:shadow-md"
                >
                  <CardContent className="p-0">
                    {/* Thumbnail/Preview */}
                    <div className="flex h-40 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                      <div className={`rounded-full p-4 ${tipoConfig.color}`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="mb-1 line-clamp-2 font-medium text-gray-900">
                            {criativo.nome}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${tipoConfig.color}`}
                            >
                              {tipoConfig.label}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-1 text-xs text-gray-500">
                        <div>
                          Criado em{" "}
                          {new Date(criativo.criadoEm).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                        <div>
                          Editado em{" "}
                          {new Date(criativo.ultimaEdicao).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditCriativo(criativo.id)}
                        >
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          Duplicar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
