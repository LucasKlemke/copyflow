# Prisma SQLite Setup - CopyFlow

## 📋 O que foi implementado

### Schema do Banco de Dados

**Relacionamentos:**

- Um usuário tem vários projetos
- Um projeto tem vários criativos
- Um criativo pertence a apenas um projeto

**Modelos:**

#### User

- `id`, `email`, `name`, `createdAt`, `updatedAt`
- Relacionamento: 1:N com Project

#### Project

- Dados básicos: `id`, `name`, `description`, `createdAt`, `updatedAt`, `status`
- Dados do formulário: `nicho`, `modeloNegocio`, `publicoIdeal`, `faixaPreco`, `promessaPrincipal`, `diferencialCompetitivo`, `nivelMarketingDigital`, `nivelCopywriting`, `faturamentoAtual`, `principalDesafio`
- Relacionamentos: N:1 com User, 1:N com Creative

#### Creative

- `id`, `title`, `content`, `type`, `status`, `createdAt`, `updatedAt`
- Relacionamento: N:1 com Project

### API Routes (CRUD Completo)

#### `/api/projects`

- **GET**: Lista todos os projetos com usuários e count de criativos
- **POST**: Cria novo projeto com todos os dados do formulário

#### `/api/projects/[id]`

- **GET**: Busca projeto específico com todos os dados
- **PUT**: Atualiza projeto (todos os campos opcionais)
- **DELETE**: Exclui projeto e seus criativos (cascade)

### Páginas Atualizadas

#### `/projetos/create`

- Integrada com API para criar projetos no banco
- Inclui todos os campos do formulário otimizado

#### `/projetos/edit/[id]`

- Carrega dados do projeto via API
- Permite edição completa dos dados
- Função de exclusão integrada

## 🚀 Como usar

### 1. Configurar Banco

```bash
# 1. Gerar cliente Prisma
npm run db:generate

# 2. Aplicar schema ao banco
npm run db:push

# 3. Popular com dados demo (opcional)
npm run db:seed
```

### 2. Visualizar Dados

```bash
# Abrir Prisma Studio
npm run db:studio
```

### 3. Scripts Disponíveis

```bash
npm run db:generate  # Gera cliente Prisma
npm run db:push      # Aplica schema ao banco
npm run db:migrate   # Cria migrações
npm run db:studio    # Interface visual do banco
npm run db:seed      # Popula banco com dados demo
```

## 💾 Estrutura do Banco

### Arquivo do Banco

- **Local**: `./dev.db` (SQLite)
- **Configuração**: `.env` com `DATABASE_URL="file:./dev.db"`

### Dados Demo

Após executar `npm run db:seed`:

- 1 usuário demo: `demo@copyflow.com`
- 1 projeto demo com todos os campos preenchidos
- 3 criativos demo (Email, Anúncio, Sales Page)

## 🔧 Exemplo de Uso na API

### Criar Projeto

```typescript
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nomeProjeto: "Meu Projeto",
    nicho: "fitness",
    modeloNegocio: "infoproduto",
    // ... outros campos
    userId: "user-id"
  })
});
```

### Buscar Projeto

```typescript
const response = await fetch('/api/projects/project-id');
const project = await response.json();
```

### Atualizar Projeto

```typescript
const response = await fetch('/api/projects/project-id', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nomeProjeto: "Novo Nome",
    status: "PAUSADO"
  })
});
```

### Excluir Projeto

```typescript
const response = await fetch('/api/projects/project-id', {
  method: 'DELETE'
});
```

## 📁 Arquivos Criados/Modificados

### Schema e Configuração

- `prisma/schema.prisma` - Schema completo com todos os campos
- `src/lib/prisma.ts` - Cliente Prisma singleton
- `prisma/seed.ts` - Dados demo

### API Routes

- `src/app/api/projects/route.ts` - GET/POST projetos
- `src/app/api/projects/[id]/route.ts` - GET/PUT/DELETE projeto específico

### Páginas

- `src/app/projetos/create/page.tsx` - Criação integrada com API
- `src/app/projetos/edit/[id]/page.tsx` - Edição integrada com API

### Tipos

- `src/types/project.ts` - Tipagem TypeScript completa

## ✅ Status

Todas as funcionalidades estão implementadas e funcionando:

- ✅ Schema atualizado com todos os campos do formulário
- ✅ CRUD completo de projetos
- ✅ Páginas integradas com API
- ✅ Dados demo populados
- ✅ Tipagem TypeScript

O sistema está pronto para uso em desenvolvimento e produção!
