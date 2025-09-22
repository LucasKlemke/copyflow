import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@copyflow.com" },
    update: {},
    create: {
      email: "demo@copyflow.com",
      name: "Demo User",
    },
  });

  console.log("Demo user created/updated:", user.id);

  // Create a demo project
  const project = await prisma.project.upsert({
    where: { id: "demo-project-1" },
    update: {},
    create: {
      id: "demo-project-1",
      name: "Demo Project",
      description: "A demo project for CopyFlow",
      userId: user.id,
      nicho: "fitness",
      modeloNegocio: "infoproduto",
      publicoIdeal: "mulher-executiva",
      faixaPreco: "R$ 497",
      promessaPrincipal: "Transforme seu corpo em 30 dias",
      diferencialCompetitivo: JSON.stringify([
        "Método exclusivo",
        "Acompanhamento personalizado",
      ]),
      nivelMarketingDigital: "intermediario",
      nivelCopywriting: "iniciante",
      faturamentoAtual: "R$ 10-50k",
      principalDesafio: "Gerar mais leads qualificados",
      status: "ATIVO",
    },
  });

  // Create demo creatives
  await prisma.creative.createMany({
    data: [
      {
        title: "Email Marketing Campaign",
        content:
          "Subject: Welcome to our amazing product!\n\nHi there,\n\nWelcome to our community...",
        type: "EMAIL",
        projectId: project.id,
      },
      {
        title: "Facebook Ad Copy",
        content:
          "Transform your life in 30 days with our revolutionary system!",
        type: "ANUNCIO",
        projectId: project.id,
      },
      {
        title: "Landing Page Copy",
        content: "The Ultimate Solution for Your Business Growth",
        type: "SALES_PAGE",
        projectId: project.id,
      },
      {
        title: "VSL Produto Fitness Revolucionário",
        content: `## Abertura Impactante

PARE TUDO! Se você está cansado de treinar sem ver resultados...

## O Problema

Durante anos você tentou de tudo: academias caras, dietas malucas, suplementos milagrosos...

## A Solução

Mas hoje você vai descobrir o sistema que já transformou mais de 10.000 pessoas...

## Call to Action

Clique no botão abaixo AGORA e garante sua vaga com 50% de desconto!`,
        type: "VSL",
        projectId: project.id,
        vslParameters: JSON.stringify({
          tipo: "media",
          duracao: "12-15",
          abordagem: "problema",
          cta: "botao",
          elementos: ["prova-social", "urgencia", "bonus"],
        }),
        chatHistory: JSON.stringify([
          {
            id: "1",
            text: "Olá! Como posso ajudar você a melhorar sua VSL?",
            isUser: false,
            timestamp: new Date().toISOString(),
          },
          {
            id: "2",
            text: "Preciso melhorar o gancho inicial",
            isUser: true,
            timestamp: new Date().toISOString(),
          },
        ]),
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
