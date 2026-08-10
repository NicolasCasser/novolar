# NovoLar

Plataforma web para adoção responsável e gestão de animais resgatados.

## Sobre o projeto

O NovoLar é um projeto acadêmico desenvolvido no curso de Análise e Desenvolvimento de Sistemas da Universidade Católica de Pelotas (UCPel).

A plataforma tem como objetivo facilitar a divulgação de animais disponíveis para adoção e organizar o gerenciamento dos animais e das solicitações de adoção em uma área administrativa.

O projeto busca aplicar conceitos de Engenharia de Software, arquitetura de sistemas, modelagem de dados, desenvolvimento de APIs e desenvolvimento de aplicações web.

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
* Jest

### Frontend

* React
* TypeScript
* Vite

### Infraestrutura

* Docker
* Docker Compose
* GitHub Actions
* GitHub
* Vercel
* Render
* Neon

## Estrutura do projeto

O projeto utiliza uma arquitetura monorepo, organizada em aplicações independentes:

```text
novolar/
├── apps/
│   ├── backend/
│   └── frontend/
├── docs/
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── package-lock.json
```

## Documentação

A documentação do projeto está disponível no diretório `docs/`.

Ela contém os documentos relacionados aos requisitos, casos de uso, modelagem de dados, arquitetura e demais decisões de projeto.

## Execução local

Os serviços do projeto podem ser executados utilizando Docker Compose:

```bash
docker compose up
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

As demais informações de configuração e execução serão documentadas conforme o desenvolvimento do projeto avançar.

## Status

Projeto em desenvolvimento.
