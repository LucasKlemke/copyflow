export interface ProjetoFormData {
  nomeProjeto: string;
  nicho: string;
  modeloNegocio: string;
  publicoIdeal: string;
  faixaPreco: string;
  promessaPrincipal: string;
  diferencialCompetitivo: string[];
  nivelMarketingDigital: string;
  nivelCopywriting: string;
  faturamentoAtual: string;
  principalDesafio: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  nicho: string;
  modeloNegocio: string;
  publicoIdeal: string;
  faixaPreco: string;
  promessaPrincipal: string;
  diferencialCompetitivo: string; // JSON string
  nivelMarketingDigital: string;
  nivelCopywriting: string;
  faturamentoAtual: string;
  principalDesafio: string;
  status: "ATIVO" | "PAUSADO" | "CONCLUIDO" | "ARQUIVADO";
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  creatives: Creative[];
  _count: {
    creatives: number;
  };
}

export interface Creative {
  id: string;
  title: string;
  content: string | null;
  type: "ANUNCIO" | "EMAIL" | "SALES_PAGE" | "VSL";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  projectId: string;
  vslParameters?: VSLFormData | null;
  chatHistory?: ChatMessage[] | null;
}

export interface VSLFormData {
  tipo: string;
  duracao: string;
  abordagem: string;
  cta: string;
  elementos: string[];
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface VSLResult {
  script: string;
  metadata?: {
    wordCount: number;
    estimatedDuration: string;
    qualityScore: number;
  };
}

export interface CreateCreativeRequest {
  title: string;
  content?: string;
  type: "ANUNCIO" | "EMAIL" | "SALES_PAGE" | "VSL";
  projectId: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  vslParameters?: VSLFormData;
  chatHistory?: ChatMessage[];
}

export interface UpdateCreativeRequest {
  title?: string;
  content?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  vslParameters?: VSLFormData;
  chatHistory?: ChatMessage[];
}

export interface CreateProjectRequest extends ProjetoFormData {
  userId: string;
}

export interface UpdateProjectRequest extends Partial<ProjetoFormData> {
  status?: "ATIVO" | "PAUSADO" | "CONCLUIDO" | "ARQUIVADO";
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}
