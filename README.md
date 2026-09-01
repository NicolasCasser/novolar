# NovoLar

Plataforma web para adoção responsável e gestão de animais resgatados.

## Sobre o projeto

O NovoLar é um projeto acadêmico desenvolvido no curso de Análise e Desenvolvimento de Sistemas da Universidade Católica de Pelotas (UCPel).

A plataforma tem como objetivo facilitar a divulgação de animais disponíveis para adoção e organizar o gerenciamento dos animais e das solicitações de adoção em uma área administrativa.

O projeto busca aplicar conceitos de Engenharia de Software, arquitetura de sistemas, modelagem de dados, desenvolvimento de APIs, desenvolvimento web, testes automatizados e práticas de integração e entrega contínuas.

## Funcionalidades

### Área pública

* Visualização de animais disponíveis para adoção;
* Pesquisa e filtragem de animais;
* Visualização do perfil dos animais;
* Registro de interesse em adoção.

### Área administrativa

* Autenticação de administradores;
* Visualização do dashboard;
* Cadastro, edição e exclusão de animais;
* Atualização do status dos animais;
* Visualização das solicitações de adoção;
* Atualização do status das solicitações.

## Tecnologias

### Backend

* NestJS
* TypeScript
* GraphQL
* TypeORM
* PostgreSQL
* JWT
* class-validator
* class-transformer
* Jest

### Frontend

* React
* TypeScript
* Vite

### Infraestrutura

* Docker
* Docker Compose
* GitHub
* GitHub Actions
* Neon
* Render
* Vercel

## Estrutura do projeto

O projeto utiliza uma arquitetura monorepo, organizada em aplicações independentes:

```text
novolar/
├── apps/
│   ├── backend/
│   │   └── src/
│   │       ├── database/
│   │       │   ├── migrations/
│   │       │   └── seeds/
│   │       └── modules/
│   └── frontend/
├── docs/
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── docker-compose.test.yml
├── package.json
└── package-lock.json
```

## Documentação

A documentação do projeto está disponível no diretório `docs/`.

Ela contém documentos relacionados aos requisitos, casos de uso, modelagem de dados, arquitetura e decisões técnicas do projeto.

## Execução local

### Pré-requisitos

* Docker
* Docker Compose

As variáveis de ambiente necessárias para execução local estão disponíveis no arquivo `.env.example`.

Após configurar o ambiente, os serviços podem ser iniciados utilizando:

```bash
docker compose up
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

## Testes

O projeto possui diferentes níveis de testes automatizados.

### Lint

```bash
npm run lint
```

### Testes unitários

```bash
npm run test
```

### Testes de integração

```bash
npm run test:integration
```

### Testes E2E

```bash
npm run test:e2e
```

### Build

```bash
npm run build
```

Os testes de integração e E2E utilizam um ambiente PostgreSQL isolado através do Docker Compose.

## CI/CD

O projeto utiliza GitHub Actions para automatizar a validação e a entrega da aplicação.

O pipeline de CI executa:

* Lint;
* Testes unitários;
* Testes de integração;
* Testes E2E;
* Build das aplicações.

O processo de deploy utiliza os resultados do CI para evitar a disponibilização de versões que não passaram pelas validações.

As migrations e o seed inicial do administrador em produção são executados automaticamente durante o processo de deploy.

## Ambiente de produção

A aplicação utiliza os seguintes serviços:

* Vercel para hospedagem do frontend;
* Render para hospedagem do backend;
* Neon para o banco de dados PostgreSQL.

### Aplicação

Frontend:

**https://novolar-web.vercel.app**

Backend:

**https://novolar.onrender.com**

## Status

Projeto em desenvolvimento ativo.
