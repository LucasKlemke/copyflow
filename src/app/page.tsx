"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { FileText, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const documentTemplates = [
  {
    id: "blank",
    name: "Criar novo criativo",
    icon: Plus,
    color: "border-dashed border-gray-300 hover:border-gray-400",
    bgColor: "bg-white",
  },
  {
    id: "letter",
    name: "Carta",
    subtitle: "Spearmint",
    color: "border-blue-200",
    bgColor: "bg-blue-50",
  },
  {
    id: "resume1",
    name: "Currículo",
    subtitle: "Serif",
    color: "border-green-200",
    bgColor: "bg-green-50",
  },
  {
    id: "resume2",
    name: "Currículo",
    subtitle: "Coral",
    color: "border-yellow-200",
    bgColor: "bg-yellow-50",
  },
  {
    id: "proposal",
    name: "Proposta de projeto",
    subtitle: "Tropic",
    color: "border-purple-200",
    bgColor: "bg-purple-50",
  },
  {
    id: "brochure",
    name: "Folheto",
    subtitle: "Geometric",
    color: "border-pink-200",
    bgColor: "bg-pink-50",
  },
  {
    id: "report",
    name: "Relatório",
    subtitle: "Luxe",
    color: "border-indigo-200",
    bgColor: "bg-indigo-50",
  },
];

const recentDocuments = [
  {
    id: "template-iot",
    name: "Template-IoT",
    lastOpened: "Aberto em 13 de set de 2023",
  },
  {
    id: "cold-email-examples",
    name: "Cold Email Examples",
    lastOpened: "Aberto em 5 de set de 2023",
  },
  {
    id: "cold-email-systemprompt",
    name: "Cold Email SystemPrompt",
    lastOpened: "Aberto em 4 de set de 2023",
  },
  {
    id: "sistema-agendamento",
    name: "Sistema de Agendamento",
    lastOpened: "Aberto em 27 de jul de 2023",
  },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user");
    if (user) {
      // User is logged in, check if they have a project
      const currentProject = localStorage.getItem("currentProject");
      if (currentProject) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } else {
      // User is not logged in, redirect to landing page
      router.push("/landing");
    }
  }, [router]);

  const handleTemplateClick = (templateId: string) => {
    if (templateId === "blank") {
      router.push("/criativos/vsl/create");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-gray-900">
          Iniciar um novo documento
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Galeria de modelos</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Template Gallery */}
      <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {documentTemplates.map(template => {
          const IconComponent = template.icon;
          return (
            <Card
              key={template.id}
              className={`group h-40 cursor-pointer transition-all hover:shadow-md ${template.color} ${template.bgColor}`}
              onClick={() => handleTemplateClick(template.id)}
            >
              <CardContent className="flex h-full flex-col items-center justify-center p-4">
                {template.id === "blank" ? (
                  <Plus className="mb-4 h-12 w-12 text-blue-600" />
                ) : (
                  <div className="mb-4 h-16 w-full rounded-sm bg-white/80 shadow-sm">
                    {/* Placeholder for document preview */}
                    <div className="flex h-full items-center justify-center">
                      <div className="space-y-1">
                        <div className="h-1 w-12 rounded bg-gray-300"></div>
                        <div className="h-1 w-8 rounded bg-gray-300"></div>
                        <div className="h-1 w-10 rounded bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    {template.name}
                  </h3>
                  {template.subtitle && (
                    <p className="text-xs text-gray-600">{template.subtitle}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Documents Section */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900">
          Documentos recentes
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Pertencente a qualquer pessoa
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Recent Documents Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recentDocuments.map(document => (
          <Card
            key={document.id}
            className="group cursor-pointer transition-all hover:shadow-md"
          >
            <CardContent className="p-0">
              {/* Document Preview */}
              <div className="h-48 bg-gray-50 p-4">
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-gray-800"></div>
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded bg-gray-300"></div>
                    <div className="h-2 w-4/5 rounded bg-gray-300"></div>
                    <div className="h-2 w-3/4 rounded bg-gray-300"></div>
                    <div className="h-2 w-full rounded bg-gray-300"></div>
                    <div className="h-2 w-2/3 rounded bg-gray-300"></div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="h-2 w-full rounded bg-gray-300"></div>
                    <div className="h-2 w-5/6 rounded bg-gray-300"></div>
                    <div className="h-2 w-4/5 rounded bg-gray-300"></div>
                    <div className="h-2 w-full rounded bg-gray-300"></div>
                    <div className="h-2 w-3/4 rounded bg-gray-300"></div>
                    <div className="h-2 w-2/3 rounded bg-gray-300"></div>
                  </div>
                </div>
              </div>

              {/* Document Info */}
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-6 w-6 items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {document.name}
                  </h3>
                  <p className="text-xs text-gray-600">{document.lastOpened}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
