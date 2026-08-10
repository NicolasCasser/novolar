# Casos de Uso

## Visão Geral

Este documento descreve os principais casos de uso da plataforma **NovoLar**, uma aplicação web para adoção responsável e gestão de animais resgatados.

Os casos de uso representam as principais interações entre os atores do sistema e a aplicação, servindo como base para a modelagem do banco de dados, definição da arquitetura e implementação das funcionalidades.

O diagrama de casos de uso está disponível nos seguintes formatos:

- [`use-cases.puml`](./diagrams/use-cases.puml) 
- [`use-cases.png`](./diagrams/use-cases.png) 

---

# Casos de Uso

## UC01 — Consultar catálogo de animais

### Ator

Visitante.

### Objetivo

Permitir que o visitante visualize os animais disponíveis para adoção.

### Pré-condições

- O sistema deve estar disponível.

### Fluxo Principal

1. O visitante acessa a página inicial.
2. O sistema apresenta o catálogo de animais disponíveis.
3. O visitante pode pesquisar animais por nome.
4. O visitante pode aplicar filtros por espécie, porte, sexo, idade, estado e cidade.

### Fluxos Alternativos

- O sistema informa que nenhum animal foi encontrado para os critérios informados.

### Pós-condições

- O catálogo é exibido conforme os critérios de pesquisa e filtros informados.

---

## UC02 — Visualizar detalhes do animal

### Ator

Visitante.

### Objetivo

Permitir que o visitante consulte todas as informações de um animal.

### Pré-condições

- O animal deve existir.

### Fluxo Principal

1. O visitante seleciona um animal.
2. O sistema apresenta suas informações completas.
3 O visitante pode iniciar o processo de adoção.

### Fluxos Alternativos

- O animal não está mais disponível.

### Pós-condições

- Os detalhes do animal são exibidos.

---

## UC03 — Registrar interesse em adoção

### Ator

Visitante.

### Objetivo

Registrar uma solicitação de interesse em adotar um animal.

### Pré-condições

- O animal deve estar disponível para adoção.

### Fluxo Principal

1. O visitante acessa o formulário de interesse.
2. Informa os dados solicitados.
3. Confirma o envio.
4. O sistema registra a solicitação.
5 O sistema apresenta uma confirmação do envio.
6 O sistema envia um e-mail de confirmação ao interessado.

### Fluxos Alternativos

- Existem campos obrigatórios não preenchidos.
- Os dados informados são inválidos.
- O animal não está mais disponível para adoção.

### Pós-condições

- A solicitação fica disponível para análise do administrador.

---

## UC04 — Autenticar-se

### Ator

Administrador.

### Objetivo

Permitir o acesso à área administrativa do sistema.

### Pré-condições

- O administrador deve possuir credenciais válidas.

### Fluxo Principal

1. O administrador informa e-mail e senha.
2. O sistema valida as credenciais.
3. O sistema concede acesso ao painel administrativo.

### Fluxos Alternativos

- Credenciais inválidas.

### Pós-condições

- O administrador encontra-se autenticado.

---

## UC05 — Gerenciar animais

### Ator

Administrador.

### Objetivo

Realizar o gerenciamento dos animais cadastrados.

### Pré-condições

- O administrador deve estar autenticado.

### Fluxo Principal

1. O administrador acessa o módulo de animais.
2. Cadastra um novo animal, quando necessário.
3. Edita informações de um animal existente.
4. Atualiza seu status de adoção.
5. Remove um animal quando necessário.
6. O sistema salva as alterações realizadas.

### Fluxos Alternativos

- Dados inválidos.
- Animal inexistente.

### Pós-condições

- O cadastro do animal permanece atualizado.

---

## UC06 — Gerenciar solicitações de adoção

### Ator

Administrador.

### Objetivo

Gerenciar as solicitações de adoção recebidas.

### Pré-condições

- O administrador deve estar autenticado.

### Fluxo Principal

1. O administrador acessa a lista de solicitações.
2. Seleciona uma solicitação.
3. Analisa as informações fornecidas.
4. Atualiza o status da solicitação.
5. O sistema registra a alteração.

### Fluxos Alternativos

- Solicitação inexistente.

### Pós-condições

- A solicitação permanece atualizada no sistema.

