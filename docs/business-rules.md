# Regras de Negócio

## Objetivo

Este documento descreve as regras de negócio da plataforma **NovoLar**.

As regras aqui apresentadas representam decisões funcionais que determinam o comportamento do sistema diante das diferentes situações do processo de adoção.

Este documento complementa os requisitos funcionais, casos de uso e modelagem de dados, servindo como referência para a implementação das regras de domínio no backend.

## Escopo

As regras descritas neste documento abrangem:

- gerenciamento dos animais;
- gerenciamento das solicitações de adoção;
- catálogo público;
- autenticação administrativa;
- integridade dos dados;
- processo de adoção.

Questões relacionadas à interface do usuário, tecnologias utilizadas e arquitetura da aplicação encontram-se documentadas em seus respectivos arquivos.

## 3. Regras dos Animais

### RN01 — Cadastro de animais

Todo animal cadastrado deverá possuir nome, espécie, raça, sexo, porte, cor, idade, localização, descrição e pelo menos uma imagem.

---

### RN02 — Status inicial

Todo animal cadastrado deverá possuir o status **Disponível** no momento de sua criação.

---

### RN03 — Idade do animal

A idade poderá ser informada em anos ou meses pelo administrador.

Independentemente da forma de entrada, o sistema armazenará internamente a idade em meses.

A conversão para anos ou meses será responsabilidade da camada de apresentação.

---

### RN04 — Imagem principal

Todo animal deverá possuir exatamente uma imagem definida como principal.

Esta imagem será utilizada nas listagens e demais locais onde apenas uma imagem for exibida.

---

### RN05 — Múltiplas imagens

Um animal poderá possuir até cinco imagens cadastradas.

---

### RN06 — Atualização de status

O administrador poderá alterar o status de um animal entre:

- Disponível;
- Adotado.

---

### RN07 — Exclusão lógica

A remoção de um animal deverá ser realizada por meio de Soft Delete, preservando seu histórico no banco de dados.

## 4. Regras das Solicitações de Adoção

### RN08 — Registro de solicitação

Uma solicitação de adoção somente poderá ser registrada para animais com status **Disponível**.

---

### RN09 — Dados obrigatórios

Toda solicitação deverá conter obrigatoriamente:

- Nome do interessado;
- E-mail;
- Telefone/WhatsApp;
- Estado;
- Cidade;
- Mensagem de interesse.

---

### RN10 — Status inicial da solicitação

Toda solicitação deverá ser criada com o status **Pendente**.

---

### RN11 — Alteração de status

O administrador poderá alterar o status da solicitação para:

- Pendente;
- Em análise;
- Aprovada;
- Rejeitada.

---

### RN12 — Histórico das solicitações

As solicitações de adoção não poderão ser excluídas, preservando o histórico do processo de adoção.

---

### RN13 — Independência das solicitações

Um mesmo animal poderá possuir múltiplas solicitações de adoção.

A aprovação ou rejeição de uma solicitação não deverá alterar automaticamente as demais.

---

### RN14 — Alteração do status do animal

A aprovação de uma solicitação não altera automaticamente o status do animal.

A atualização do status do animal será realizada manualmente pelo administrador.

---

### RN15 — Confirmação ao interessado

Após o envio da solicitação, o sistema deverá enviar um e-mail de confirmação ao interessado contendo um resumo da solicitação realizada.

---

### RN16 — Responsabilidade da análise

A análise das solicitações será realizada exclusivamente por administradores autenticados.

## 5. Regras do Catálogo Público

### RN17 — Animais exibidos

O catálogo público deverá exibir apenas animais com status **Disponível**.

---

### RN18 — Pesquisa

A pesquisa de animais deverá ser realizada pelo nome do animal.

---

### RN19 — Filtros

O catálogo deverá permitir filtrar animais por:

- Espécie;
- Porte;
- Sexo;
- Idade;
- Estado;
- Cidade.

---

### RN20 — Dependência entre Estado e Cidade

O filtro de cidades somente deverá ser habilitado após a seleção de um estado.

As cidades disponíveis deverão corresponder ao estado selecionado.

---

### RN21 — Origem dos estados e municípios

A lista de estados e municípios deverá ser obtida por meio da API oficial do IBGE, não sendo armazenada pela aplicação.

---

### RN22 — Ordenação

O catálogo deverá permitir ordenar os animais por:

- Mais recentes;
- Idade.

---

### RN23 — Paginação

O catálogo deverá utilizar paginação para limitar a quantidade de animais exibidos por página.

---

### RN24 — Detalhes do animal

Todas as informações públicas de um animal deverão ser acessadas exclusivamente através da página de detalhes do animal.

## 6. Regras Administrativas

### RN25 — Acesso administrativo

A área administrativa deverá ser acessível apenas por usuários autenticados.

---

### RN26 — Perfil de acesso

Na primeira versão do sistema existirá apenas um perfil de usuário: **Administrador**.

---

### RN27 — Autenticação

O acesso à área administrativa será realizado por meio de e-mail e senha.

Após autenticação bem-sucedida, o sistema deverá conceder acesso às funcionalidades administrativas.

---

### RN28 — Dashboard

O dashboard administrativo deverá apresentar indicadores baseados apenas em registros ativos do sistema.

---

### RN29 — Cadastro de animais

Todo animal cadastrado deverá ser associado ao administrador responsável pelo seu cadastro.

---

### RN30 — Observações internas

As observações registradas em uma solicitação deverão ser visíveis apenas para administradores autenticados.

---

### RN31 — Exclusividade das funcionalidades administrativas

As funcionalidades de cadastro, edição, exclusão de animais e gerenciamento de solicitações deverão estar disponíveis exclusivamente na área administrativa.

## 7. Regras de Integridade

### RN32 — Exclusão de animais

Um animal não poderá ser removido enquanto possuir solicitações com status **Pendente** ou **Em análise**.

---

### RN33 — Exclusão lógica

A exclusão de animais e administradores deverá ser realizada por meio de Soft Delete, preservando o histórico dos registros.

---

### RN34 — Exclusão de administradores

Um administrador não poderá ser removido enquanto existirem animais cadastrados sob sua responsabilidade.

---

### RN35 — Imagem principal

Cada animal deverá possuir exatamente uma imagem marcada como principal.

---

### RN36 — Integridade das solicitações

Toda solicitação deverá estar obrigatoriamente vinculada a um único animal.

---

### RN37 — Integridade das imagens

Toda imagem cadastrada deverá estar obrigatoriamente vinculada a um único animal.

---

### RN38 — Unicidade do e-mail

Não poderá existir mais de um administrador cadastrado utilizando o mesmo endereço de e-mail.

---

### RN39 — Consistência da localização

A cidade informada para um animal ou para uma solicitação deverá pertencer ao estado selecionado.

Essa validação será realizada utilizando os dados disponibilizados pela API oficial do IBGE.

---

### RN40 — Preservação do histórico

As solicitações de adoção não poderão ser excluídas, garantindo a preservação do histórico do processo de adoção.

---

## Considerações

As regras descritas neste documento representam o comportamento esperado da plataforma NovoLar na primeira versão do projeto.

Novas regras poderão ser incorporadas conforme a evolução do sistema e a inclusão de novas funcionalidades.

## Histórico de Revisões

| Data | Versão | Alterações |
|------|--------|------------|
| 06/08/2026 | 1.0 | Criação inicial do documento de regras de negócio. |