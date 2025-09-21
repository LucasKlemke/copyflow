// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// Onboarding Data Types
export interface OnboardingData {
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

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  onboardingData: OnboardingData;
  createdAt: string;
  updatedAt: string;
}

// Criativo Types
export type CriativoType =
  | "vsl"
  | "sales-page"
  | "email"
  | "anuncio"
  | "funil"
  | "isca-digital"
  | "webinar";
export type CriativoStatus =
  | "rascunho"
  | "em-revisao"
  | "concluido"
  | "arquivado";

export interface Criativo {
  id: string;
  name: string;
  tipo: CriativoType;
  status: CriativoStatus;
  projectId: string;
  userId: string;
  content: CriativoContent;
  metadata: CriativoMetadata;
  createdAt: string;
  updatedAt: string;
}

// VSL Specific Types
export interface VSLFormData {
  tipo: string;
  duracao: string;
  abordagem: string;
  cta: string;
  elementos: string[];
}

export interface VSLResult {
  script: string;
  slides: string[];
  tempoEstimado: {
    introducao: string;
    desenvolvimento: string;
    cta: string;
    total: string;
  };
  ctasPositions: string[];
  teleprompter: string;
}

// Generic Criativo Content (union type for different criativo types)
export type CriativoContent =
  | VSLContent
  | SalesPageContent
  | EmailContent
  | AnuncioContent;

export interface VSLContent {
  type: "vsl";
  formData: VSLFormData;
  result?: VSLResult;
  script: string;
}

export interface SalesPageContent {
  type: "sales-page";
  headline: string;
  subheadline?: string;
  sections: SalesPageSection[];
  cta: string;
}

export interface SalesPageSection {
  id: string;
  type:
    | "hero"
    | "problema"
    | "solucao"
    | "beneficios"
    | "prova-social"
    | "cta"
    | "bonus"
    | "garantia";
  content: string;
  order: number;
}

export interface EmailContent {
  type: "email";
  subject: string;
  preheader?: string;
  body: string;
  cta?: string;
  emailType: "welcome" | "nurture" | "sales" | "followup";
}

export interface AnuncioContent {
  type: "anuncio";
  headline: string;
  description: string;
  cta: string;
  platform: "facebook" | "google" | "instagram" | "linkedin";
  targetAudience?: string;
}

// Metadata for analytics and organization
export interface CriativoMetadata {
  wordCount?: number;
  estimatedReadTime?: number;
  tags: string[];
  version: number;
  lastEditedBy: string;
  comments?: CriativoComment[];
  performance?: CriativoPerformance;
}

export interface CriativoComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isResolved: boolean;
}

export interface CriativoPerformance {
  views?: number;
  conversions?: number;
  clickThroughRate?: number;
  engagementRate?: number;
  lastTracked?: string;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form State Types
export interface FormState {
  isLoading: boolean;
  errors: Record<string, string>;
  isDirty: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalCriativos: number;
  concluidos: number;
  emRevisao: number;
  rascunhos: number;
  ultimaAtividade: string;
}

export interface CriativoFilter {
  type?: CriativoType | "todos";
  status?: CriativoStatus | "todos";
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Chat/AI Assistant Types
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  criativoId?: string;
}

export interface SuggestedAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  actionType: "improve" | "generate" | "analyze" | "export";
}

// Export all commonly used types
export type {
  User,
  Project,
  Criativo,
  OnboardingData,
  CriativoType,
  CriativoStatus,
  VSLFormData,
  VSLResult,
  FormState,
  DashboardStats,
};
