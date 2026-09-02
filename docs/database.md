# Modelagem de Dados

## Objetivo

Este documento descreve a modelagem de dados da plataforma **NovoLar**, apresentando as entidades, atributos, relacionamentos, enums e decisões de modelagem adotadas para o projeto.

A modelagem foi desenvolvida considerando três objetivos principais:

* atender aos requisitos acadêmicos da disciplina;
* seguir boas práticas utilizadas no mercado;
* permitir a evolução futura da aplicação sem necessidade de grandes refatorações.

---

# Visão Geral

A aplicação possui quatro entidades principais:

* **User**: representa os administradores responsáveis pela gestão da plataforma.
* **Animal**: representa os animais resgatados cadastrados na plataforma.
* **AnimalImage**: representa as imagens associadas aos animais.
* **AdoptionRequest**: representa as solicitações de adoção enviadas pelos interessados.

Relacionamentos:

* Um administrador pode cadastrar vários animais.
* Um animal pertence a um único administrador responsável pelo cadastro.
* Um animal pode possuir várias imagens.
* Um animal pode possuir várias solicitações de adoção.
* Cada imagem pertence a um único animal.
* Cada solicitação pertence a um único animal.

---

# Diagrama Entidade-Relacionamento

O DER do projeto está disponível em:

* [`erd.mmd`](./diagrams/erd.mmd)
* [`erd.png`](./diagrams/erd.png)

---

# Entidades

## User

Representa um administrador autenticado da plataforma.

### Atributos

| Campo     | Tipo      | Restrições       | Descrição                           |
| --------- | --------- | ---------------- | ----------------------------------- |
| id        | UUID      | PK               | Identificador único.                |
| name      | VARCHAR   | NOT NULL         | Nome completo.                      |
| email     | VARCHAR   | UNIQUE, NOT NULL | E-mail utilizado para autenticação. |
| password  | VARCHAR   | NOT NULL         | Senha armazenada como hash.         |
| createdAt | TIMESTAMP | NOT NULL         | Data de criação do registro.        |
| updatedAt | TIMESTAMP | NOT NULL         | Data da última atualização.         |
| deletedAt | TIMESTAMP | NULL             | Utilizado para Soft Delete.         |

### Relacionamentos

* Um **User** pode cadastrar vários **Animals**.

### Observações

* Utiliza Soft Delete para preservar o histórico do administrador.
* Apenas administradores possuem cadastro de usuário na primeira versão do sistema.
* A exclusão lógica de um administrador não remove os animais anteriormente cadastrados por ele.
* O campo `createdByUserId` dos animais mantém a referência ao administrador responsável pelo cadastro.

---

## Animal

Representa um animal resgatado cadastrado na plataforma.

### Atributos

| Campo           | Tipo      | Restrições   | Descrição                                 |
| --------------- | --------- | ------------ | ----------------------------------------- |
| id              | UUID      | PK           | Identificador único.                      |
| name            | VARCHAR   | NOT NULL     | Nome ou identificação amigável do animal. |
| description     | TEXT      | NOT NULL     | Descrição detalhada do animal.            |
| species         | ENUM      | NOT NULL     | Espécie do animal.                        |
| breed           | VARCHAR   | NOT NULL     | Raça do animal ou `SRD`.                  |
| sex             | ENUM      | NOT NULL     | Sexo do animal.                           |
| size            | ENUM      | NOT NULL     | Porte do animal.                          |
| color           | VARCHAR   | NOT NULL     | Cor predominante.                         |
| state           | ENUM      | NOT NULL     | Estado onde o animal está localizado.     |
| city            | VARCHAR   | NOT NULL     | Cidade onde o animal está localizado.     |
| ageInMonths     | INTEGER   | NOT NULL     | Idade estimada do animal em meses.        |
| vaccinated      | BOOLEAN   | NOT NULL     | Indica se o animal está vacinado.         |
| neutered        | BOOLEAN   | NOT NULL     | Indica se o animal é castrado.            |
| status          | ENUM      | NOT NULL     | Situação atual do animal.                 |
| createdByUserId | UUID      | FK, NOT NULL | Administrador responsável pelo cadastro.  |
| createdAt       | TIMESTAMP | NOT NULL     | Data de criação do registro.              |
| updatedAt       | TIMESTAMP | NOT NULL     | Data da última atualização.               |
| deletedAt       | TIMESTAMP | NULL         | Utilizado para Soft Delete.               |

### Relacionamentos

* Pertence a um único **User**.
* Possui várias **AnimalImages**.
* Pode possuir várias **AdoptionRequests**.

### Observações

* Utiliza Soft Delete.
* Todo animal é cadastrado inicialmente com status `AVAILABLE`.
* O status pode assumir somente `AVAILABLE` ou `ADOPTED`.
* O status passa automaticamente para `ADOPTED` quando uma solicitação de adoção é aprovada.
* A idade é armazenada internamente em meses.
* A camada de apresentação é responsável por converter a idade para a forma adequada de entrada ou exibição.
* O campo `breed` é obrigatório. Quando a raça não for conhecida ou definida, será utilizado o valor `SRD`.
* O campo `createdByUserId` identifica o administrador que realizou o cadastro do animal.
* A localização do animal é composta por estado e cidade.

---

## AnimalImage

Representa uma imagem associada a um animal.

### Atributos

| Campo     | Tipo      | Restrições   | Descrição                                 |
| --------- | --------- | ------------ | ----------------------------------------- |
| id        | UUID      | PK           | Identificador único.                      |
| animalId  | UUID      | FK, NOT NULL | Animal relacionado.                       |
| url       | VARCHAR   | NOT NULL     | Caminho ou URL da imagem armazenada.      |
| isPrimary | BOOLEAN   | NOT NULL     | Indica se é a imagem principal do animal. |
| createdAt | TIMESTAMP | NOT NULL     | Data de criação do registro.              |
| updatedAt | TIMESTAMP | NOT NULL     | Data da última atualização.               |

### Relacionamentos

* Pertence a um único **Animal**.

### Observações

* Um animal pode possuir no máximo cinco imagens.
* Todo animal deve possuir exatamente uma imagem definida como principal.
* A imagem principal será utilizada nas listagens e em outros locais onde apenas uma imagem for exibida.
* O armazenamento físico das imagens é responsabilidade da camada de infraestrutura.
* A entidade não utiliza Soft Delete nesta versão.

---

## AdoptionRequest

Representa uma solicitação de interesse em adoção realizada por um visitante.

### Atributos

| Campo          | Tipo      | Restrições   | Descrição                       |
| -------------- | --------- | ------------ | ------------------------------- |
| id             | UUID      | PK           | Identificador único.            |
| animalId       | UUID      | FK, NOT NULL | Animal desejado.                |
| applicantName  | VARCHAR   | NOT NULL     | Nome do interessado.            |
| applicantEmail | VARCHAR   | NOT NULL     | E-mail para contato.            |
| applicantPhone | VARCHAR   | NOT NULL     | Telefone/WhatsApp.              |
| city           | VARCHAR   | NOT NULL     | Cidade do interessado.          |
| state          | ENUM      | NOT NULL     | Unidade Federativa (UF).        |
| message        | TEXT      | NOT NULL     | Mensagem de interesse.          |
| status         | ENUM      | NOT NULL     | Situação atual da solicitação.  |
| createdAt      | TIMESTAMP | NOT NULL     | Data de criação da solicitação. |
| updatedAt      | TIMESTAMP | NOT NULL     | Data da última atualização.     |

### Relacionamentos

* Pertence a um único **Animal**.

### Observações

* Não utiliza Soft Delete.
* As solicitações não podem ser excluídas, preservando o histórico do processo de adoção.
* O campo `status` representa o estado atual da solicitação.
* Um mesmo animal pode possuir múltiplas solicitações.
* Uma solicitação somente pode ser criada para um animal com status `AVAILABLE`.

### Status

#### PENDING

A solicitação foi recebida, mas o administrador ainda não iniciou o processo de avaliação do interessado.

#### IN_ANALYSIS

O administrador entrou em contato com o interessado e iniciou o processo de avaliação da solicitação.

#### APPROVED

O interessado foi aprovado e a adoção foi efetivada.

Quando uma solicitação passa para `APPROVED`:

* o animal relacionado passa para `ADOPTED`;
* as demais solicitações `PENDING` ou `IN_ANALYSIS` relacionadas ao mesmo animal passam para `CANCELED`.

#### REJECTED

A solicitação foi analisada e o interessado não foi aprovado para a adoção.

#### CANCELED

A solicitação foi cancelada porque outra solicitação referente ao mesmo animal foi aprovada.

---

# Enums

## AnimalSpecies

* DOG
* CAT
* BIRD
* RABBIT
* OTHER

## AnimalSex

* MALE
* FEMALE

## AnimalSize

* SMALL
* MEDIUM
* LARGE

## AnimalStatus

* AVAILABLE
* ADOPTED

## AdoptionRequestStatus

* PENDING
* IN_ANALYSIS
* APPROVED
* REJECTED
* CANCELED

## BrazilianState

Enum contendo as 27 Unidades Federativas do Brasil.

Exemplos:

* AC
* AL
* AP
* ...
* RS
* SC
* SP
* TO

---

# Regras de Integridade

* O e-mail do administrador deve ser único.
* Todo animal deve possuir um administrador responsável pelo cadastro.
* Um administrador pode cadastrar vários animais.
* Um administrador pode ser submetido a Soft Delete sem que os animais anteriormente cadastrados por ele sejam removidos.
* Um animal pode possuir várias imagens.
* Um animal pode possuir no máximo cinco imagens.
* Todo animal deve possuir exatamente uma imagem principal.
* Um animal pode possuir várias solicitações de adoção.
* Toda solicitação pertence obrigatoriamente a um único animal.
* Solicitações de adoção não podem ser excluídas.
* Uma solicitação somente pode ser criada para animais com status `AVAILABLE`.
* Solicitações `PENDING` e `IN_ANALYSIS` são consideradas ativas.
* Um animal não poderá ser removido enquanto possuir solicitações `PENDING` ou `IN_ANALYSIS`.
* O campo `breed` é obrigatório e deve possuir um valor válido, podendo utilizar `SRD` quando a raça não for conhecida.
* A aprovação de uma solicitação deve resultar na alteração do animal relacionado para `ADOPTED`.
* A aprovação de uma solicitação deve resultar no cancelamento das demais solicitações `PENDING` ou `IN_ANALYSIS` relacionadas ao mesmo animal.
* Animais e usuários utilizam Soft Delete.
* As solicitações de adoção são preservadas para manter o histórico do processo.

---

# Convenções de Modelagem

* Todas as entidades utilizam UUID como chave primária.
* Todas as tabelas possuem `createdAt` e `updatedAt`.
* Apenas as entidades `User` e `Animal` utilizam Soft Delete (`deletedAt`).
* Os nomes das entidades seguem o padrão PascalCase.
* Os nomes dos atributos seguem o padrão camelCase.
* Os valores enumerados são armazenados como ENUM nativo do PostgreSQL.
* A idade dos animais é armazenada em meses por meio do campo `ageInMonths`.
* A localização utiliza um ENUM para a Unidade Federativa e texto para a cidade.
* A entidade `AnimalImage` é utilizada para permitir múltiplas imagens por animal.
