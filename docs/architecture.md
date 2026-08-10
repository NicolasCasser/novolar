# Arquitetura do Sistema

## Objetivo

Este documento descreve a arquitetura da plataforma **NovoLar**, apresentando as principais decisões técnicas adotadas durante o desenvolvimento do projeto.

As tecnologias e padrões escolhidos buscam atender aos requisitos acadêmicos da disciplina, seguir boas práticas utilizadas no mercado e fornecer uma base sólida para evolução futura da aplicação.

---

# Visão Geral

A plataforma NovoLar será desenvolvida como um **monólito modular**, organizado em um **monorepositório (monorepo)**, utilizando arquitetura em camadas para promover baixo acoplamento, alta coesão e facilidade de manutenção.

A aplicação será composta por:

- Frontend Web desenvolvido em React;
- Backend desenvolvido em NestJS;
- Banco de dados PostgreSQL;
- Comunicação entre frontend e backend utilizando GraphQL.

---

# Arquitetura da Aplicação

A plataforma segue uma arquitetura em camadas, separando responsabilidades entre apresentação, aplicação, persistência e armazenamento de arquivos.

Essa organização promove baixo acoplamento entre os componentes, facilita a manutenção do sistema e permite sua evolução ao longo do tempo.

O diagrama de arquitetura está disponível em:

- [`architecture.mmd`](./diagrams/architecture.mmd)
- [`architecture.png`](./diagrams/architecture.png)

---

# Organização do Repositório

O projeto será organizado em um monorepositório contendo frontend, backend e documentação.

```text
novolar/

├── apps/
│   ├── backend/
│   └── frontend/
│
├── docs/
│   ├── diagrams/
│   ├── requirements.md
│   ├── use-cases.md
│   ├── database.md
│   └── architecture.md
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# Backend

## Tecnologias

- NestJS
- TypeScript
- GraphQL (Code First)
- TypeORM
- PostgreSQL
- JWT
- Cookie HttpOnly

## Estrutura

O backend será organizado por módulos de domínio.

Exemplo:

```text
src/

modules/

├── auth/
├── users/
├── animals/
├── animal-images/
└── adoption-requests/
└── locations/
```

Cada módulo possuirá sua própria organização em camadas, contendo:

- Resolver
- Service
- Repository
- DTOs
- Entities
- Tests

Essa abordagem favorece encapsulamento e facilita a evolução do sistema.

## Integrações Externas

Dependências de serviços externos serão acessadas por meio de abstrações (Providers), evitando acoplamento da lógica de negócio a implementações específicas.

Inicialmente, o módulo `locations` será responsável por consultar e validar estados e municípios através de um provedor externo. O restante da aplicação consumirá apenas esse módulo, sem depender diretamente da fonte dos dados.

Essa abordagem facilita testes, manutenção e futuras substituições de provedores sem impacto nas regras de negócio.

---

# Frontend

## Tecnologias

- React
- Vite
- TypeScript
- React Router
- TanStack Query
- React Hook Form
- Zod

## Organização

O frontend será organizado em componentes reutilizáveis, páginas e serviços responsáveis pela comunicação com a API GraphQL.

A aplicação utilizará:

- Context API para autenticação e estados globais simples;
- TanStack Query para gerenciamento do estado proveniente da API.

---

# Banco de Dados

O banco de dados utilizado será o PostgreSQL.

O acesso aos dados será realizado através do TypeORM.

As entidades principais do sistema são:

- User
- Animal
- AnimalImage
- AdoptionRequest

Todas as entidades utilizam UUID como chave primária.

---

# Comunicação entre Frontend e Backend

A comunicação será realizada utilizando GraphQL.

Foi adotada a abordagem **Code First**, permitindo que o schema GraphQL seja gerado automaticamente a partir das classes TypeScript.

Essa abordagem reduz duplicação de código e facilita a manutenção do projeto.

---

# Autenticação e Autorização

O acesso à área administrativa será protegido utilizando:

- JWT
- Cookie HttpOnly
- Guards do NestJS
- Roles

Inicialmente haverá apenas o perfil:

- ADMIN

O primeiro administrador será criado através de uma seed.

---

# Armazenamento de Imagens

As imagens dos animais serão representadas pela entidade `AnimalImage`.

A aplicação utilizará uma abstração para armazenamento de arquivos.

Inicialmente o armazenamento poderá ser realizado localmente durante o desenvolvimento.

A arquitetura permanecerá preparada para utilização futura de diferentes provedores de armazenamento de objetos, sem necessidade de alterações na camada de domínio.

---

# Containerização

Todo o ambiente de desenvolvimento será executado utilizando Docker Compose.

Cada serviço possuirá seu próprio container:

- Frontend
- Backend
- PostgreSQL

Essa abordagem garante padronização do ambiente e reduz problemas de configuração entre diferentes máquinas.

---

# Deploy

O projeto será preparado para deploy desde o início do desenvolvimento.

A estratégia inicial prevê:

- Frontend hospedado na Vercel;
- Backend hospedado em serviço compatível com Docker;
- Banco PostgreSQL gerenciado;
- Evolução futura para infraestrutura em nuvem mais robusta, caso necessário.

---

# Qualidade de Código

Para manter um padrão consistente de desenvolvimento serão utilizadas as seguintes ferramentas:

- ESLint
- Prettier
- Husky
- lint-staged

Essas ferramentas auxiliam na padronização do código e evitam problemas comuns durante o desenvolvimento.

---

# Estratégia de Testes

O projeto adotará diferentes níveis de testes automatizados.

- Testes unitários para regras de negócio;
- Testes de integração para validação dos módulos;
- Testes de componentes no frontend.

Testes End-to-End poderão ser implementados posteriormente, caso o cronograma permita.

---

# Decisões Arquiteturais

| Decisão | Escolha |
|----------|---------|
| Organização do projeto | Monorepo |
| Arquitetura | Monólito Modular |
| Backend | NestJS |
| Frontend | React + Vite |
| API | GraphQL (Code First) |
| ORM | TypeORM |
| Banco de Dados | PostgreSQL |
| Autenticação | JWT + Cookie HttpOnly |
| Gerenciamento de Estado | TanStack Query + Context API |
| Validação Backend | class-validator + class-transformer |
| Validação Frontend | React Hook Form + Zod |
| Containerização | Docker + Docker Compose |
| Testes | Unitários + Integração |
| Deploy | Cloud com serviços gratuitos na primeira versão |
| Integrações Externas | Providers (Abstrações) |