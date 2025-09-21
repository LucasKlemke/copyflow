"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft, FileText, Mail, Megaphone, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CRIATIVO_TYPES = [
  {
    id: "vsl",
    title: "VSL (Video Sales Letter)",
    description: "Scripts persuasivos para vídeos de vendas",
    icon: Video,
    color: "bg-blue-100 text-blue-600 border-blue-200",
    route: "/criativos/vsl/create",
    available: true,
  },
  {
    id: "sales-page",
    title: "Sales Page",
    description: "Páginas de vendas otimizadas para conversão",
    icon: FileText,
    color: "bg-green-100 text-green-600 border-green-200",
    route: "/criativos/sales-page/create",
    available: false,
  },
  {
    id: "email",
    title: "Email Marketing",
    description: "Sequências de email que nutrem e convertem",
    icon: Mail,
    color: "bg-purple-100 text-purple-600 border-purple-200",
    route: "/criativos/email/create",
    available: false,
  },
  {
    id: "anuncio",
    title: "Anúncios Pagos",
    description: "Copies para Facebook, Google e outras plataformas",
    icon: Megaphone,
    color: "bg-yellow-100 text-yellow-600 border-yellow-200",
    route: "/criativos/anuncio/create",
    available: false,
  },
];

export default function CriativosPage() {
  const router = useRouter();

  const handleCreateCriativo = (tipo: (typeof CRIATIVO_TYPES)[0]) => {
    if (tipo.available) {
      router.push(tipo.route);
    } else {
      alert(`${tipo.title} será implementado em breve!`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900">
            Criar Novo Criativo
          </h1>
          <p className="mt-2 text-gray-600">
            Escolha o tipo de criativo que deseja criar para seu projeto
          </p>
        </div>
      </div>

      {/* Criativo Types Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CRIATIVO_TYPES.map(tipo => {
          const IconComponent = tipo.icon;

          return (
            <Card
              key={tipo.id}
              className={`cursor-pointer border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                tipo.available
                  ? `${tipo.color} hover:shadow-md`
                  : "border-gray-200 bg-gray-50 opacity-75"
              }`}
              onClick={() => handleCreateCriativo(tipo)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-full p-3 ${tipo.available ? tipo.color : "bg-gray-100 text-gray-400"}`}
                  >
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle
                      className={`text-xl ${tipo.available ? "text-gray-900" : "text-gray-500"}`}
                    >
                      {tipo.title}
                      {!tipo.available && (
                        <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-600">
                          Em breve
                        </span>
                      )}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p
                  className={`text-sm ${tipo.available ? "text-gray-600" : "text-gray-400"}`}
                >
                  {tipo.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div
                    className={`text-xs ${tipo.available ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {tipo.available
                      ? "Clique para começar"
                      : "Disponível em breve"}
                  </div>

                  {tipo.available && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Criar Agora
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mt-12 text-center">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="mb-2 text-lg font-semibold text-blue-900">
              Novos tipos de criativos em desenvolvimento
            </h3>
            <p className="text-sm text-blue-700">
              Estamos trabalhando para trazer mais opções de criativos para sua
              ferramenta. Sales Pages, Email Marketing e Anúncios Pagos estarão
              disponíveis em breve.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
