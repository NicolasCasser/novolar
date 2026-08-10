# Modelagem de Dados

## Objetivo

Este documento descreve a modelagem de dados da plataforma **NovoLar**, apresentando as entidades, atributos, relacionamentos, enums e decisões de modelagem adotadas para o projeto.

A modelagem foi desenvolvida considerando três objetivos principais:

- atender aos requisitos acadêmicos da disciplina;
- seguir boas práticas utilizadas no mercado;
- permitir a evolução futura da aplicação sem necessidade de grandes refatorações.

---

# Visão Geral

A aplicação possui três entidades principais:

- **User**: representa os administradores responsáveis pela gestão da plataforma.
- **Animal**: representa os animais resgatados disponíveis para adoção.
- **AnimalImage**: representa as imagens associadas aos animais.
- **AdoptionRequest**: representa as solicitações de adoção enviadas pelos interessados.

Relacionamentos:

- Um administrador pode cadastrar vários animais.
- Um animal pode possuir várias imagens.
- Um animal pode possuir várias solicitações de adoção.
- Cada imagem pertence a um único animal.
- Cada solicitação pertence a um único animal.

---

# Diagrama Entidade-Relacionamento

O DER do projeto está disponível em:

- [`erd.mmd`](./diagrams/erd.mmd)
- [`erd.png`](./diagrams/erd.png)

---

# Entidades

## User

Representa um administrador autenticado da plataforma.

### Atributos

| Campo | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | UUID | PK | Identificador único. |
| name | VARCHAR | NOT NULL | Nome completo. |
| email | VARCHAR | UNIQUE, NOT NULL | E-mail utilizado para autenticação. |
| password | VARCHAR | NOT NULL | Senha criptografada (hash). |
| createdAt | TIMESTAMP | NOT NULL | Data de criação do registro. |
| updatedAt | TIMESTAMP | NOT NULL | Data da última atualização. |
| deletedAt | TIMESTAMP | NULL | Utilizado para Soft Delete. |

### Relacionamentos

- Um **User** pode cadastrar vários **Animals**.

### Observações

- Utiliza Soft Delete para preservar histórico.
- Apenas administradores possuem cadastro na plataforma.

---

## Animal

Representa um animal resgatado disponível para adoção.

### Atributos

| Campo | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | UUID | PK | Identificador único. |
| name | VARCHAR | NOT NULL | Nome ou identificação amigável do animal. |
| description | TEXT | NOT NULL | Descrição detalhada do animal. |
| species | ENUM | NOT NULL | Espécie do animal. |
| breed | VARCHAR | NOT NULL | Raça ou SRD. |
| sex | ENUM | NOT NULL | Sexo do animal. |
| size | ENUM | NOT NULL | Porte. |
| color | VARCHAR | NOT NULL | Cor predominante. |
| state | ENUM | NOT NULL | Estado onde o animal está disponível. |
| city | VARCHAR | NOT NULL | Cidade onde o animal está disponível. |
| ageInMonths | INTEGER | NOT NULL | Idade estimada em meses. |
| vaccinated | BOOLEAN | NOT NULL | Indica se o animal está vacinado. |
| neutered | BOOLEAN | NOT NULL | Indica se o animal é castrado. |
| status | ENUM | NOT NULL | Situação atual do animal. |
| createdByUserId | UUID | FK, NOT NULL | Administrador responsável pelo cadastro. |
| createdAt | TIMESTAMP | NOT NULL | Data de criação do registro. |
| updatedAt | TIMESTAMP | NOT NULL | Data da última atualização. |
| deletedAt | TIMESTAMP | NULL | Utilizado para Soft Delete. |

### Relacionamentos

- Pertence a um único **User**.
- Possui várias **AnimalImages**.
- Pode possuir várias **AdoptionRequests**.

### Observações

- Utiliza Soft Delete.
- A idade é armazenada em meses para manter maior precisão.
- A conversão para meses ou anos é responsabilidade da camada de apresentação.

---

## AnimalImage

Representa uma imagem associada a um animal.

### Atributos

| Campo | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | UUID | PK | Identificador único. |
| animalId | UUID | FK, NOT NULL | Animal relacionado. |
| url | VARCHAR | NOT NULL | Caminho ou URL da imagem armazenada. |
| isPrimary | BOOLEAN | NOT NULL | Indica se é a imagem principal do animal. |
| createdAt | TIMESTAMP | NOT NULL | Data de criação do registro. |
| updatedAt | TIMESTAMP | NOT NULL | Data da última atualização. |

### Relacionamentos

- Pertence a um único **Animal**.

### Observações

- Permite que um animal possua múltiplas imagens.
- A aplicação pode utilizar uma imagem principal para exibição no catálogo.
- O armazenamento físico das imagens é responsabilidade da camada de infraestrutura.

---

## AdoptionRequest

Representa uma solicitação de adoção realizada por um interessado.

### Atributos

| Campo | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | UUID | PK | Identificador único. |
| animalId | UUID | FK, NOT NULL | Animal desejado. |
| applicantName | VARCHAR | NOT NULL | Nome do interessado. |
| applicantEmail | VARCHAR | NOT NULL | E-mail para contato. |
| applicantPhone | VARCHAR | NOT NULL | Telefone/WhatsApp. |
| city | VARCHAR | NOT NULL | Cidade do interessado. |
| state | ENUM | NOT NULL | Unidade Federativa (UF). |
| message | TEXT | NOT NULL | Mensagem. |
| status | ENUM | NOT NULL | Situação da solicitação. |
| createdAt | TIMESTAMP | NOT NULL | Data de criação. |
| updatedAt | TIMESTAMP | NOT NULL | Data da última atualização. |

### Relacionamentos

- Pertence a um único **Animal**.

### Observações

- Não utiliza Soft Delete.
- Representa um registro histórico do processo de adoção.

---

# Enums

## AnimalSpecies

- DOG
- CAT
- BIRD
- RABBIT
- OTHER

## AnimalSex

- MALE
- FEMALE

## AnimalSize

- SMALL
- MEDIUM
- LARGE

## AnimalStatus

- AVAILABLE
- ADOPTED

## AdoptionRequestStatus

- PENDING
- APPROVED
- REJECTED

## BrazilianState

Enum contendo as 27 Unidades Federativas do Brasil.

Exemplo:

- AC
- AL
- AP
- ...
- RS
- SC
- SP
- TO

---

# Regras de Integridade

- O e-mail do administrador deve ser único.
- Todo animal deve possuir um administrador responsável pelo cadastro.
- Um administrador pode cadastrar vários animais.
- Um animal pode possuir várias imagens.
- Um animal pode possuir várias solicitações de adoção.
- Toda solicitação pertence obrigatoriamente a um único animal.
- Animais e usuários utilizam Soft Delete.
- Solicitações de adoção não podem ser excluídas.
- Apenas animais sem solicitações ativas podem ser removidos.
- A exclusão física de um administrador é restrita enquanto existirem animais associados (`ON DELETE RESTRICT`).
- O campo `breed` deve possuir um valor válido, podendo utilizar **SRD** (Sem Raça Definida).

---

# Convenções de Modelagem

- Todas as entidades utilizam UUID como chave primária.
- Todas as tabelas possuem `createdAt` e `updatedAt`.
- Apenas as entidades `User` e `Animal` utilizam Soft Delete (`deletedAt`).
- Os nomes das entidades e atributos seguem o padrão PascalCase (entidades) e camelCase (atributos).
- Os valores enumerados são armazenados como ENUM nativo do PostgreSQL.