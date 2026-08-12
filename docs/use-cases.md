# Casos de Uso

## Visão Geral

Este documento descreve os principais casos de uso da plataforma **NovoLar**, uma aplicação web para adoção responsável e gestão de animais resgatados.

Os casos de uso representam as principais interações entre os atores do sistema e a aplicação, servindo como base para a definição das funcionalidades e do comportamento esperado do sistema.

O diagrama de casos de uso está disponível nos seguintes formatos:

- [`use-cases.puml`](./diagrams/use-cases.puml)
- [`use-cases.png`](./diagrams/use-cases.png)

---

# Casos de Uso

## UC01 — Consultar catálogo de animais

### Ator

Visitante.

### Objetivo

Permitir que o visitante consulte os animais disponíveis para adoção.

### Pré-condições

- O sistema deve estar disponível.

### Fluxo Principal

1. O visitante acessa a página inicial.
2. O sistema apresenta os animais disponíveis para adoção.
3. O visitante pode pesquisar animais pelo nome.
4. O visitante pode aplicar filtros por espécie, porte, sexo, idade, estado e cidade.
5. O sistema apresenta os animais correspondentes aos critérios informados.

### Fluxos Alternativos

- Nenhum animal corresponde aos critérios de pesquisa ou filtros informados.
- O sistema informa que nenhum animal foi encontrado.

### Pós-condições

- O visitante visualiza os animais disponíveis conforme os critérios informados.

---

## UC02 — Visualizar detalhes do animal

### Ator

Visitante.

### Objetivo

Permitir que o visitante consulte as informações de um animal e manifeste interesse em sua adoção.

### Pré-condições

- O animal deve existir.

### Fluxo Principal

1. O visitante seleciona um animal no catálogo.
2. O sistema apresenta as informações do animal.
3. O visitante pode iniciar o processo de manifestação de interesse em adoção.

### Fluxos Alternativos

- O animal não está mais disponível para adoção.
- O sistema informa que o animal não está mais disponível.

### Pós-condições

- Os detalhes do animal são apresentados ao visitante.

---

## UC03 — Registrar interesse em adoção

### Ator

Visitante.

### Objetivo

Permitir que o visitante registre uma solicitação de interesse em adotar um animal.

### Pré-condições

- O animal deve estar disponível para adoção.

### Fluxo Principal

1. O visitante acessa o formulário de interesse em adoção.
2. O sistema apresenta os dados necessários para o registro da solicitação.
3. O visitante informa seus dados e sua mensagem de interesse.
4. O visitante confirma o envio.
5. O sistema registra a solicitação.
6. O sistema apresenta uma confirmação do envio.
7. O sistema envia uma confirmação da solicitação ao interessado.

### Fluxos Alternativos

- Existem campos obrigatórios não preenchidos.
- Os dados informados são inválidos.
- O animal deixa de estar disponível antes da confirmação do envio.
- O sistema informa que não é possível registrar a solicitação para o animal.

### Pós-condições

- A solicitação é registrada com status **PENDING** e fica disponível para análise do administrador.

---

## UC04 — Autenticar-se

### Ator

Administrador.

### Objetivo

Permitir que o administrador acesse a área administrativa.

### Pré-condições

- O administrador deve possuir credenciais válidas.

### Fluxo Principal

1. O administrador informa seu e-mail e senha.
2. O sistema valida as credenciais.
3. O sistema concede acesso à área administrativa.

### Fluxos Alternativos

- As credenciais informadas são inválidas.
- O sistema informa que não foi possível autenticar o administrador.

### Pós-condições

- O administrador encontra-se autenticado e pode acessar as funcionalidades administrativas.

---

## UC05 — Gerenciar animais

### Ator

Administrador.

### Objetivo

Permitir que o administrador cadastre, edite, consulte e gerencie os animais da plataforma.

### Pré-condições

- O administrador deve estar autenticado.

### Fluxo Principal

1. O administrador acessa o módulo de animais.
2. O administrador cadastra um novo animal ou seleciona um animal existente.
3. O sistema apresenta as informações do animal.
4. O administrador pode cadastrar ou alterar as informações do animal.
5. O administrador pode gerenciar as imagens do animal.
6. O administrador pode atualizar o status do animal.
7. O administrador pode remover um animal quando permitido.
8. O sistema registra as alterações realizadas.

### Fluxos Alternativos

- Os dados informados são inválidos.
- O animal selecionado não existe.
- O animal não pode ser removido devido a solicitações que ainda estejam em andamento.
- O sistema informa o motivo pelo qual a operação não pode ser realizada.

### Pós-condições

- O cadastro do animal permanece atualizado conforme as operações realizadas pelo administrador.

---

## UC06 — Gerenciar solicitações de adoção

### Ator

Administrador.

### Objetivo

Permitir que o administrador acompanhe e gerencie as solicitações de adoção recebidas.

### Pré-condições

- O administrador deve estar autenticado.

### Fluxo Principal

1. O administrador acessa a lista de solicitações de adoção.
2. O sistema apresenta as solicitações recebidas.
3. O administrador seleciona uma solicitação.
4. O sistema apresenta as informações fornecidas pelo interessado.
5. O administrador inicia a análise da solicitação, quando aplicável.
6. O administrador pode atualizar o status da solicitação.
7. O sistema registra a alteração realizada.

### Fluxos Alternativos

- A solicitação não existe.
- O administrador coloca a solicitação em **IN_ANALYSIS** após iniciar o contato e a avaliação do interessado.
- O administrador rejeita a solicitação.
- O administrador aprova a solicitação.

### Fluxo de aprovação

1. O administrador aprova a solicitação após concluir a avaliação do interessado.
2. O sistema altera o status da solicitação aprovada para **APPROVED**.
3. O sistema altera o status do animal relacionado para **ADOPTED**.
4. O sistema cancela as demais solicitações ainda em andamento relacionadas ao mesmo animal.
5. O sistema registra as alterações realizadas.

### Fluxo de rejeição

1. O administrador rejeita a solicitação.
2. O sistema altera o status da solicitação para **REJECTED**.
3. As demais solicitações relacionadas ao animal permanecem inalteradas.

### Pós-condições

- A solicitação permanece registrada com seu status atualizado.
- Quando uma solicitação é aprovada, o animal relacionado passa a ser considerado adotado e as demais solicitações em andamento são canceladas.

---

# Estados das solicitações

As solicitações de adoção podem assumir os seguintes estados:

- **PENDING** — solicitação recebida e ainda não iniciada pelo administrador;
- **IN_ANALYSIS** — administrador iniciou o contato e o processo de avaliação do interessado;
- **APPROVED** — solicitação aprovada e processo de adoção concluído;
- **REJECTED** — solicitação recusada durante o processo de avaliação;
- **CANCELED** — solicitação cancelada porque outra solicitação relacionada ao mesmo animal foi aprovada.