"use client";

import Link from "next/link";

import {
  ArrowRight,
  Check,
  FileText,
  Mail,
  Megaphone,
  Star,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Video,
    title: "VSL Inteligentes",
    description:
      "Crie scripts de vídeo persuasivos com IA baseada no seu público-alvo",
  },
  {
    icon: FileText,
    title: "Sales Pages",
    description: "Páginas de vendas otimizadas para conversão máxima",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Sequências de email que nutrem e convertem seus leads",
  },
  {
    icon: Megaphone,
    title: "Anúncios Pagos",
    description: "Copies para Facebook, Google e outras plataformas",
  },
];

const benefits = [
  "Onboarding personalizado baseado no seu negócio",
  "IA treinada em copywriting de alta conversão",
  "Templates otimizados para diferentes nichos",
  "Editor colaborativo com sugestões em tempo real",
  "Métricas de performance dos seus criativos",
  "Suporte para múltiplos projetos",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative overflow-hidden bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-lg font-bold text-white">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CopyFlow</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Começar Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
              Crie <span className="text-blue-600">Copies Persuasivos</span>
              <br />
              com Inteligência Artificial
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              Transforme seu marketing digital com criativos otimizados para
              conversão. O CopyFlow usa IA para criar VSLs, sales pages, emails
              e anúncios personalizados para seu negócio.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="flex items-center gap-2">
                  Criar Conta Grátis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Ver Demo
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Setup em 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Suporte em português</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Tudo que você precisa para vender mais
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Ferramentas completas para criar criativos de alta conversão
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                Por que escolher o CopyFlow?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="p-8">
                <div className="text-center">
                  <div className="mb-4 flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                  <blockquote className="mb-4 text-lg text-gray-700">
                    "O CopyFlow revolucionou meu marketing. Em 30 dias aumentei
                    minhas vendas em 300% com os criativos gerados pela
                    plataforma."
                  </blockquote>
                  <div>
                    <p className="font-semibold text-gray-900">Marina Santos</p>
                    <p className="text-sm text-gray-600">
                      Coach de Relacionamentos
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            Pronto para transformar seu marketing?
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            Junte-se a milhares de empreendedores que já aumentaram suas vendas
            com o CopyFlow
          </p>

          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-blue-600">
              Começar Agora - É Grátis
            </Button>
          </Link>

          <p className="mt-4 text-sm text-blue-200">
            Sem compromisso. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-sm font-bold text-white">C</span>
              </div>
              <span className="text-lg font-bold text-white">CopyFlow</span>
            </div>

            <p className="text-sm text-gray-400">
              © 2024 CopyFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
