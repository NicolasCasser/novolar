# Arquitetura do Sistema

## Objetivo

Este documento descreve a arquitetura da plataforma **NovoLar**, apresentando as principais decisões técnicas adotadas durante o desenvolvimento do projeto.

As tecnologias e padrões escolhidos buscam atender aos requisitos acadêmicos da disciplina, seguir boas práticas utilizadas no mercado e fornecer uma base sólida para evolução futura da aplicação.

---

# Visão Geral

A plataforma NovoLar é desenvolvida como um **monólito modular**, organizado em um **monorepositório (monorepo)**, utilizando arquitetura em camadas para promover baixo acoplamento, alta coesão e facilidade de manutenção.

A aplicação é composta por:

* Frontend Web desenvolvido em React;
* Backend desenvolvido em NestJS;
* Banco de dados PostgreSQL;
* Comunicação entre frontend e backend utilizando GraphQL.

---

# Arquitetura da Aplicação

A plataforma segue uma arquitetura em camadas, separando responsabilidades entre apresentação, aplicação, persistência e infraestrutura.

Essa organização promove baixo acoplamento entre os componentes, facilita a manutenção do sistema e permite sua evolução ao longo do tempo.

O diagrama de arquitetura está disponível em:

* [`architecture.mmd`](./diagrams/architecture.mmd)
* [`architecture.png`](./diagrams/architecture.png)

---

# Organização do Repositório

O projeto é organizado em um monorepositório contendo frontend, backend e documentação.

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
│   ├── business-rules.md
│   ├── database.md
│   ├── architecture.md
│   └── design-system.md
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# Backend

## Tecnologias

* NestJS;
* TypeScript;
* GraphQL (Code First);
* TypeORM;
* PostgreSQL;
* JWT;
* Cookie `HttpOnly`.

## Estrutura

O backend é organizado por módulos de domínio.

Exemplo:

```text
src/

├── common/
│
└── modules/
    ├── auth/
    ├── users/
    ├── animals/
    ├── adoption-requests/
    └── locations/
```

Os módulos são responsáveis por organizar as funcionalidades relacionadas aos seus respectivos domínios.

Dentro dos módulos são utilizadas camadas como:

* Resolver;
* Service;
* DTOs;
* Entities;
* Tests.

O acesso aos dados é realizado utilizando os recursos de persistência fornecidos pelo TypeORM, mantendo a lógica de negócio nos services e a exposição da API nos resolvers.

A estrutura poderá ser expandida conforme novas necessidades do domínio sejam identificadas.

## Integrações Externas

Dependências de serviços externos serão acessadas por meio de abstrações (Providers), evitando acoplamento da lógica de negócio a implementações específicas.

O módulo `locations` será responsável por consultar e validar estados e municípios através da API oficial do IBGE. O restante da aplicação consumirá essa funcionalidade por meio da abstração definida pelo sistema, sem depender diretamente da fonte dos dados.

Essa abordagem facilita testes, manutenção e futuras substituições de provedores sem impacto nas regras de negócio.

---

# Frontend

## Tecnologias

* React;
* Vite;
* TypeScript;
* React Router;
* Apollo Client;
* React Hook Form;
* Zod.

## Organização

O frontend é organizado em páginas, componentes reutilizáveis e estruturas responsáveis pela comunicação com a API GraphQL.

A aplicação utiliza:

* Context API para autenticação e estados globais simples;
* Apollo Client para comunicação com a API GraphQL e gerenciamento dos dados provenientes do servidor;
* React Hook Form para gerenciamento de formulários;
* Zod para validação dos dados dos formulários.

---

# Banco de Dados

O banco de dados utilizado é o PostgreSQL.

O acesso aos dados é realizado através do TypeORM.

As entidades principais do sistema são:

* User;
* Animal;
* AnimalImage;
* AdoptionRequest.

Todas as entidades utilizam UUID como chave primária.

As regras de modelagem e os relacionamentos entre as entidades estão documentados em [`database.md`](./database.md).

---

# Comunicação entre Frontend e Backend

A comunicação entre frontend e backend é realizada utilizando GraphQL.

Foi adotada a abordagem **Code First**, permitindo que o schema GraphQL seja gerado a partir das classes TypeScript.

No frontend, o Apollo Client é utilizado para realizar as operações GraphQL e gerenciar os dados retornados pela API.

Essa abordagem reduz duplicação de código e facilita a manutenção do contrato entre frontend e backend.

---

# Autenticação e Autorização

O acesso à área administrativa é protegido utilizando:

* JWT;
* Cookie `HttpOnly`;
* Guards do NestJS;
* Controle de acesso por perfil.

Inicialmente existe apenas o perfil:

* ADMIN.

O primeiro administrador é criado através de uma seed.

Após a autenticação, o JWT é armazenado em cookie `HttpOnly`, evitando que o token fique disponível diretamente para scripts executados no navegador.

---

# Armazenamento de Imagens

As imagens dos animais são representadas pela entidade `AnimalImage`.

A aplicação utiliza uma abstração para armazenamento de arquivos.

Durante o desenvolvimento, o armazenamento pode ser realizado localmente.

A arquitetura permanece preparada para utilização futura de diferentes provedores de armazenamento de objetos, sem necessidade de alterações na camada de domínio.

---

# Containerização

O ambiente de desenvolvimento utiliza Docker Compose.

Os principais serviços são:

* Frontend;
* Backend;
* PostgreSQL.

Essa abordagem garante maior padronização do ambiente e reduz problemas de configuração entre diferentes máquinas.

---

# Deploy

A estratégia de deploy da primeira versão utiliza serviços gerenciados e gratuitos ou com plano gratuito:

* Frontend hospedado na **Vercel**;
* Backend hospedado no **Render**;
* Banco de dados PostgreSQL hospedado no **Neon**.

A aplicação é preparada para que os componentes possam evoluir posteriormente para infraestruturas de maior escala sem alterações fundamentais na arquitetura.

---

# Qualidade de Código

Para manter um padrão consistente de desenvolvimento são utilizadas as seguintes ferramentas:

* ESLint;
* Prettier;
* Husky;
* lint-staged.

Essas ferramentas auxiliam na padronização do código e na identificação de problemas antes da integração das alterações.

---

# Estratégia de Testes

O projeto adota diferentes níveis de testes automatizados:

* Testes unitários para regras e comportamentos isolados;
* Testes de integração para validação da interação entre componentes do backend e banco de dados;
* Testes End-to-End para validação dos principais fluxos da aplicação.

Os testes são executados automaticamente no processo de CI.

O pipeline de CI também realiza:

* lint;
* testes automatizados;
* build.

Alterações destinadas à integração ao projeto devem passar pelo pipeline antes do merge.

---

# Decisões Arquiteturais

| Decisão                 | Escolha                             |
| ----------------------- | ----------------------------------- |
| Organização do projeto  | Monorepo                            |
| Arquitetura             | Monólito Modular                    |
| Backend                 | NestJS + TypeScript                 |
| Frontend                | React + Vite + TypeScript           |
| API                     | GraphQL (Code First)                |
| Cliente GraphQL         | Apollo Client                       |
| ORM                     | TypeORM                             |
| Banco de Dados          | PostgreSQL                          |
| Autenticação            | JWT + Cookie `HttpOnly`             |
| Autorização             | Guards + perfil ADMIN               |
| Gerenciamento de estado | Apollo Client + Context API         |
| Validação Backend       | class-validator + class-transformer |
| Validação Frontend      | React Hook Form + Zod               |
| Containerização         | Docker + Docker Compose             |
| Testes                  | Unitários + Integração + E2E        |
| CI/CD                   | GitHub Actions                      |
| Frontend em produção    | Vercel                              |
| Backend em produção     | Render                              |
| Banco em produção       | Neon                                |
| Integrações Externas    | Providers (Abstrações)              |
