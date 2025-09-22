# Integração de Autenticação com Banco de Dados - CopyFlow

## 🔐 Sistema de Autenticação Implementado

### Fluxo de Autenticação

**Cadastro de Usuário:**

1. Usuário preenche formulário de signup (`/auth/signup`)
2. API valida dados e cria usuário no banco (`/api/auth/signup`)
3. Usuário é redirecionado para onboarding (`/onboarding`)

**Login de Usuário:**

1. Usuário faz login (`/auth/login`)
2. API valida credenciais no banco (`/api/auth/login`)
3. Usuário é redirecionado para dashboard (`/dashboard`)

**Criação de Projetos:**

1. Sistema usa ID do usuário autenticado
2. Projetos são vinculados ao usuário logado
3. Dados são salvos corretamente no banco

## 📁 Arquivos Criados/Modificados

### APIs de Autenticação

- `src/app/api/auth/signup/route.ts` - Cadastro de usuários
- `src/app/api/auth/login/route.ts` - Login de usuários
- `src/app/api/users/[userId]/projects/route.ts` - Projetos por usuário

### Páginas Atualizadas

- `src/app/auth/signup/page.tsx` - Integrada com API do banco
- `src/app/auth/login/page.tsx` - Integrada com API do banco
- `src/app/projetos/create/page.tsx` - Usa ID do usuário autenticado

### Hooks e Utilitários

- `src/hooks/useAuth.ts` - Hook para gerenciamento de autenticação
- `src/types/project.ts` - Tipos TypeScript para auth e projetos

### Banco de Dados

- `prisma/seed.ts` - Atualizado com usuário demo
- Schema já suporta relacionamento User → Project

## 🚀 Como Testar

### 1. Configurar Banco

```bash
# Aplicar schema e popular dados
npm run db:push
npm run db:seed
```

### 2. Testar Cadastro

1. Acesse `/auth/signup`
2. Crie uma conta com email/senha
3. Verifique redirecionamento para onboarding
4. Usuário será salvo no banco

### 3. Testar Login

1. Acesse `/auth/login`
2. Use as credenciais criadas OU use `demo@copyflow.com`
3. Verifique redirecionamento para dashboard

### 4. Testar Criação de Projeto

1. Após login, vá para `/projetos/create`
2. Preencha o formulário de projeto
3. Projeto será vinculado ao usuário logado
4. Dados salvos no banco com relacionamento correto

## 🔧 APIs Disponíveis

### Autenticação

#### POST `/api/auth/signup`

```typescript
// Request
{
  "email": "user@example.com",
  "password": "123456",
  "name": "Nome do Usuário" // opcional
}

// Response
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "Nome do Usuário",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Usuário criado com sucesso"
}
```

#### POST `/api/auth/login`

```typescript
// Request
{
  "email": "user@example.com",
  "password": "123456"
}

// Response
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "Nome do Usuário",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Login realizado com sucesso"
}
```

### Projetos por Usuário

#### GET `/api/users/[userId]/projects`

```typescript
// Response: Array de projetos do usuário
[
  {
    "id": "project-id",
    "name": "Nome do Projeto",
    "description": "Descrição",
    "nicho": "fitness",
    "modeloNegocio": "infoproduto",
    // ... outros campos
    "user": {
      "id": "user-id",
      "name": "Nome do Usuário",
      "email": "user@example.com"
    },
    "_count": {
      "creatives": 3
    }
  }
]
```

## 🔨 Hook useAuth

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const {
    user,           // Dados do usuário logado
    isLoading,      // Loading state
    login,          // Função de login
    signup,         // Função de cadastro
    logout,         // Função de logout
    requireAuth,    // Validar se está autenticado
    isAuthenticated // Boolean se está logado
  } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Olá, {user?.name}!</p>
      ) : (
        <p>Faça login</p>
      )}
    </div>
  );
}
```

## 🛡️ Relacionamentos no Banco

```
User (1) -----> (N) Project (1) -----> (N) Creative
│                   │
│                   └── userId (FK)
└── id (PK)
```

**Cascata de Exclusão:**

- Deletar User → deleta todos os Projects
- Deletar Project → deleta todos os Creatives

## ⚠️ Notas de Segurança

### Atual (Desenvolvimento)

- Senhas não são hasheadas (apenas para demo)
- Autenticação via localStorage
- Sem tokens JWT

### Para Produção (Implementar)

```bash
npm install bcryptjs jsonwebtoken
```

**Implementar:**

1. Hash de senhas com bcrypt
2. Tokens JWT para sessões
3. Middleware de autenticação
4. Rate limiting nas APIs
5. Validação com Zod

## ✅ Status da Integração

- ✅ Cadastro de usuários no banco
- ✅ Login com validação no banco
- ✅ Projetos vinculados ao usuário autenticado
- ✅ Hook useAuth para gerenciamento
- ✅ Tipos TypeScript completos
- ✅ APIs RESTful funcionais
- ✅ Relacionamentos corretos no banco

O sistema está **100% funcional** para desenvolvimento e pronto para implementação de melhorias de segurança para produção! 🎉
