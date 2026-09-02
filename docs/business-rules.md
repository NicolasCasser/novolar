# Regras de Negócio

## Objetivo

Este documento descreve as regras de negócio da plataforma **NovoLar**.

As regras apresentadas determinam o comportamento esperado do sistema diante das diferentes situações relacionadas ao gerenciamento de animais, imagens, solicitações de adoção, catálogo público e administração da plataforma.

Este documento complementa os requisitos funcionais, casos de uso e modelagem de dados, servindo como referência para a implementação das regras de domínio no backend.

## Escopo

As regras descritas neste documento abrangem:

* gerenciamento dos animais;
* gerenciamento das imagens dos animais;
* gerenciamento das solicitações de adoção;
* catálogo público;
* autenticação administrativa;
* integridade dos dados;
* processo de adoção;
* exclusão lógica dos registros.

Questões relacionadas à interface, tecnologias e arquitetura encontram-se documentadas em seus respectivos arquivos.

---

# 3. Regras dos Animais

### RN01 — Dados obrigatórios do animal

Todo animal cadastrado deverá possuir obrigatoriamente:

* Nome;
* Espécie;
* Raça;
* Sexo;
* Porte;
* Cor;
* Idade;
* Estado;
* Cidade;
* Descrição;
* Informação sobre vacinação;
* Informação sobre castração;
* Pelo menos uma imagem.

---

### RN02 — Raça do animal

A raça deverá ser informada obrigatoriamente.

Quando a raça do animal não for conhecida ou definida, deverá ser utilizado o valor **SRD (Sem Raça Definida)**.

A raça será armazenada como texto, permitindo tanto raças específicas quanto o valor SRD.

---

### RN03 — Espécie do animal

A espécie deverá ser selecionada a partir dos valores definidos pelo enum `AnimalSpecies`:

* DOG;
* CAT;
* BIRD;
* RABBIT;
* OTHER.

---

### RN04 — Status inicial

Todo animal cadastrado deverá possuir o status **AVAILABLE** no momento de sua criação.

---

### RN05 — Status do animal

O status de um animal poderá assumir somente os seguintes valores:

* **AVAILABLE** — disponível para adoção;
* **ADOPTED** — adotado.

Um animal deverá passar automaticamente para `ADOPTED` quando uma de suas solicitações de adoção for aprovada.

O status do animal não deverá ser alterado manualmente para valores diferentes dos definidos pelo processo de adoção.

---

### RN06 — Idade do animal

A idade poderá ser informada pelo administrador em anos ou meses.

Independentemente da forma de entrada, o sistema deverá armazenar internamente a idade em meses, utilizando o campo `ageInMonths`.

A conversão entre anos e meses será responsabilidade da camada de apresentação.

---

### RN07 — Localização do animal

Todo animal deverá possuir estado e cidade de localização.

O estado deverá utilizar o enum `BrazilianState`.

A cidade deverá ser informada de acordo com o estado selecionado.

---

### RN08 — Consistência da localização do animal

A cidade informada para um animal deverá pertencer ao estado selecionado.

A validação deverá utilizar os dados disponibilizados pela API oficial do IBGE.

Os dados de estados e municípios não serão armazenados pela aplicação como uma tabela própria.

---

### RN09 — Imagens do animal

Todo animal deverá possuir pelo menos uma imagem e poderá possuir no máximo cinco imagens cadastradas.

As imagens serão armazenadas por meio da entidade `AnimalImage`, não diretamente na entidade `Animal`.

---

### RN10 — Imagem principal

Todo animal deverá possuir exatamente uma imagem definida como principal.

A imagem principal será utilizada nos contextos em que apenas uma imagem do animal for exibida, como o catálogo público.

---

### RN11 — Integridade das imagens

Toda imagem deverá estar obrigatoriamente vinculada a um único animal.

Uma imagem não poderá existir sem um animal associado.

---

### RN12 — Informações de vacinação e castração

Todo animal deverá possuir informações sobre:

* vacinação;
* castração.

Essas informações deverão ser armazenadas como valores booleanos.

---

### RN13 — Exclusão lógica de animais

A remoção de um animal deverá ser realizada por meio de Soft Delete.

O registro deverá permanecer armazenado no banco de dados, permitindo a preservação de seu histórico.

---

### RN14 — Responsabilidade pelo cadastro

Todo animal deverá estar associado a um único administrador responsável pelo seu cadastro.

Um administrador poderá cadastrar vários animais.

---

# 4. Regras das Solicitações de Adoção

### RN15 — Registro de solicitação

Uma solicitação de adoção somente poderá ser registrada para um animal com status **AVAILABLE**.

---

### RN16 — Dados obrigatórios da solicitação

Toda solicitação deverá conter obrigatoriamente:

* Nome do interessado;
* E-mail;
* Telefone/WhatsApp;
* Estado;
* Cidade;
* Mensagem de interesse.

---

### RN17 — Status inicial da solicitação

Toda solicitação deverá ser criada com o status **PENDING**.

---

### RN18 — Status das solicitações

Uma solicitação poderá possuir somente um dos seguintes status:

* **PENDING** — solicitação recebida e ainda não iniciada pelo administrador;
* **IN_ANALYSIS** — administrador iniciou o contato e o processo de avaliação do interessado;
* **APPROVED** — solicitação aprovada e processo de adoção concluído;
* **REJECTED** — solicitação recusada durante o processo de avaliação;
* **CANCELED** — solicitação cancelada porque outra solicitação referente ao mesmo animal foi aprovada.

---

### RN19 — Alteração do status da solicitação

A alteração do status das solicitações será realizada exclusivamente por administradores autenticados, exceto pelas alterações automáticas previstas no processo de adoção.

As transições permitidas são:

* `PENDING` → `IN_ANALYSIS`;
* `PENDING` → `APPROVED`;
* `PENDING` → `REJECTED`;
* `IN_ANALYSIS` → `APPROVED`;
* `IN_ANALYSIS` → `REJECTED`.

O status `CANCELED` será atribuído automaticamente pelo sistema quando outra solicitação do mesmo animal for aprovada.

Solicitações em estados finais não deverão retornar para estados anteriores.

---

### RN20 — Início da análise

O status `IN_ANALYSIS` deverá ser utilizado quando o administrador entrar em contato com o interessado e iniciar o processo de avaliação da solicitação.

A utilização desse status permite distinguir solicitações que ainda aguardam atendimento daquelas que já estão em processo de avaliação.

---

### RN21 — Múltiplas solicitações

Um mesmo animal poderá possuir múltiplas solicitações de adoção enquanto estiver com status `AVAILABLE`.

A existência de uma solicitação em análise não impedirá o recebimento de novas solicitações para o mesmo animal.

---

### RN22 — Aprovação de solicitação

Uma solicitação somente poderá ser aprovada por um administrador autenticado e enquanto estiver com status `PENDING` ou `IN_ANALYSIS`.

Ao aprovar uma solicitação:

1. A solicitação deverá assumir o status `APPROVED`.
2. O animal relacionado deverá passar automaticamente para `ADOPTED`.
3. Todas as demais solicitações do mesmo animal que estejam com status `PENDING` ou `IN_ANALYSIS` deverão passar automaticamente para `CANCELED`.

---

### RN23 — Cancelamento das demais solicitações

Quando uma solicitação for aprovada, as demais solicitações relacionadas ao mesmo animal que ainda estiverem em processo deverão ser canceladas automaticamente.

Somente solicitações com status:

* `PENDING`;
* `IN_ANALYSIS`;

deverão ser alteradas automaticamente para `CANCELED`.

Solicitações que já estejam `APPROVED`, `REJECTED` ou `CANCELED` não deverão ser alteradas.

---

### RN24 — Rejeição de solicitação

A rejeição de uma solicitação deverá alterar somente o status da própria solicitação para `REJECTED`.

A rejeição somente poderá ocorrer enquanto a solicitação estiver com status `PENDING` ou `IN_ANALYSIS`.

As demais solicitações relacionadas ao mesmo animal não deverão ser alteradas automaticamente.

---

### RN25 — Solicitação após aprovação

Um animal com status `ADOPTED` não poderá receber novas solicitações de adoção.

---

### RN26 — Exclusão de solicitações

Solicitações de adoção não poderão ser excluídas.

Os registros deverão ser preservados para manter o histórico do processo de adoção.

---

### RN27 — Integridade das solicitações

Toda solicitação deverá estar obrigatoriamente vinculada a um único animal.

Uma solicitação não poderá existir sem um animal associado.

---

### RN28 — Localização do interessado

Toda solicitação deverá possuir estado e cidade do interessado.

O estado deverá utilizar o enum `BrazilianState`.

A cidade deverá corresponder ao estado informado.

---

### RN29 — Consistência da localização do interessado

A cidade informada na solicitação deverá pertencer ao estado selecionado.

A validação deverá utilizar os dados disponibilizados pela API oficial do IBGE.

---

### RN30 — Confirmação da solicitação

Após o registro de uma solicitação de adoção, o sistema poderá enviar um e-mail de confirmação ao interessado contendo um resumo da solicitação realizada.

O envio do e-mail não deverá ser condição para que a solicitação seja registrada.

---

### RN31 — Responsabilidade pela análise

A análise e o gerenciamento das solicitações de adoção serão realizados exclusivamente por administradores autenticados.

---

# 5. Regras do Catálogo Público

### RN32 — Animais exibidos

O catálogo público deverá exibir somente animais com status `AVAILABLE` e que não tenham sido removidos logicamente.

Animais com status `ADOPTED` ou removidos logicamente não deverão aparecer no catálogo de animais disponíveis.

---

### RN33 — Pesquisa por nome

O catálogo deverá permitir a pesquisa de animais pelo nome.

---

### RN34 — Filtros

O catálogo deverá permitir filtrar animais por:

* Espécie;
* Porte;
* Sexo;
* Idade;
* Estado;
* Cidade.

---

### RN35 — Dependência entre estado e cidade

O filtro de cidades deverá depender do estado selecionado.

As cidades disponibilizadas como opção de filtro deverão corresponder ao estado selecionado.

---

### RN36 — Ordenação

O catálogo deverá permitir a ordenação dos animais por:

* Mais recentes;
* Idade.

---

### RN37 — Paginação

O catálogo deverá utilizar paginação para limitar a quantidade de animais exibidos por página.

---

### RN38 — Detalhes do animal

A página de detalhes deverá apresentar todas as informações públicas disponíveis sobre o animal.

---

### RN39 — Animal indisponível

Caso um animal deixe de estar disponível para adoção, ele não deverá mais aparecer no catálogo de animais disponíveis.

O acesso público aos seus detalhes deverá respeitar o status atual do animal, não permitindo o início de uma nova solicitação quando o animal estiver `ADOPTED`.

---

# 6. Regras Administrativas

### RN40 — Acesso administrativo

A área administrativa deverá ser acessível somente por usuários autenticados.

---

### RN41 — Perfil de acesso

Na primeira versão do sistema existirá somente um perfil de usuário:

* Administrador.

Não haverá diferentes níveis de permissão entre administradores.

---

### RN42 — Autenticação

O acesso administrativo deverá ser realizado por meio de e-mail e senha.

Após a validação bem-sucedida das credenciais, o sistema deverá conceder acesso às funcionalidades administrativas.

A autenticação deverá utilizar JWT armazenado em cookie `HttpOnly`.

---

### RN43 — Unicidade do e-mail

Não poderá existir mais de um administrador utilizando o mesmo endereço de e-mail.

---

### RN44 — Exclusividade das funcionalidades administrativas

As seguintes funcionalidades deverão estar disponíveis exclusivamente para administradores autenticados:

* cadastro de animais;
* edição de animais;
* gerenciamento das imagens dos animais;
* exclusão de animais;
* visualização de solicitações;
* alteração dos status das solicitações.

A alteração do status dos animais ocorrerá automaticamente de acordo com o processo de adoção.

---

### RN45 — Dashboard

Os indicadores apresentados no dashboard administrativo deverão considerar somente registros ativos do sistema.

Registros removidos logicamente não deverão ser considerados nos indicadores.

---

# 7. Regras de Integridade

### RN46 — Exclusão de animais com solicitações em andamento

Um animal não poderá ser removido enquanto possuir solicitações com status:

* `PENDING`;
* `IN_ANALYSIS`.

Solicitações com status `APPROVED`, `REJECTED` ou `CANCELED` não impedirão a exclusão lógica do animal, pois representam histórico encerrado.

---

### RN47 — Exclusão lógica de administradores

A remoção de um administrador deverá ser realizada por meio de Soft Delete.

O registro deverá permanecer armazenado para preservação do histórico.

A existência de animais anteriormente cadastrados pelo administrador não deverá impedir sua exclusão lógica.

---

### RN48 — Integridade da imagem principal

Cada animal deverá possuir exatamente uma imagem marcada como principal.

A aplicação deverá impedir que um animal permaneça sem imagem principal ou com mais de uma imagem principal.

---

### RN49 — Limite de imagens

Um animal não poderá possuir mais de cinco imagens cadastradas.

---

### RN50 — Integridade das relações

As seguintes relações deverão ser obrigatoriamente respeitadas:

* Todo animal pertence a um administrador;
* Toda imagem pertence a um animal;
* Toda solicitação pertence a um animal.

---

### RN51 — Preservação do histórico

As solicitações de adoção deverão permanecer armazenadas independentemente de seu status.

Solicitações `APPROVED`, `REJECTED` e `CANCELED` deverão continuar disponíveis para consulta administrativa como histórico do processo de adoção.

---

# 8. Regras de Segurança e Privacidade

### RN52 — Proteção das credenciais

As senhas dos administradores deverão ser armazenadas utilizando hash seguro com `bcrypt`.

O sistema não deverá armazenar senhas em texto puro.

---

### RN53 — Proteção das funcionalidades administrativas

As funcionalidades administrativas deverão exigir autenticação baseada em JWT.

O token de autenticação deverá ser armazenado em cookie `HttpOnly`, impedindo seu acesso direto por JavaScript no navegador.

---

### RN54 — Dados dos interessados

Os dados fornecidos pelos interessados nas solicitações de adoção deverão ser acessíveis somente aos administradores autenticados.

---

# 9. Processo de Adoção

### RN55 — Processo de análise

Uma solicitação inicialmente permanecerá com status `PENDING`.

Quando o administrador entrar em contato com o interessado e iniciar o processo de avaliação, a solicitação poderá passar para `IN_ANALYSIS`.

---

### RN56 — Aprovação e adoção

A aprovação de uma solicitação representa a decisão de realizar a adoção daquele animal.

Ao aprovar uma solicitação:

* a solicitação passa para `APPROVED`;
* o animal passa automaticamente para `ADOPTED`;
* as demais solicitações `PENDING` ou `IN_ANALYSIS` do mesmo animal passam para `CANCELED`.

---

### RN57 — Rejeição

A rejeição de uma solicitação não altera o status do animal nem das demais solicitações.

A solicitação rejeitada passa para `REJECTED`.

---

### RN58 — Cancelamento automático

O status `CANCELED` será utilizado quando uma solicitação deixar de ser válida porque outra solicitação referente ao mesmo animal foi aprovada.

O cancelamento automático deverá ocorrer somente para solicitações `PENDING` ou `IN_ANALYSIS`.

---

### RN59 — Encerramento do processo

Após a aprovação de uma solicitação, o animal será considerado adotado e não poderá receber novas solicitações.

As solicitações relacionadas ao animal permanecerão armazenadas para preservação do histórico.

---

## Considerações

As regras descritas neste documento representam o comportamento definido para a primeira versão da plataforma NovoLar.

Este documento deverá ser atualizado sempre que uma nova decisão de negócio alterar o comportamento esperado do sistema.

Novas funcionalidades ou alterações de escopo deverão ser refletidas também nos requisitos, casos de uso e modelagem de dados correspondentes, evitando divergências entre os documentos do projeto.

## Pontos que não fazem parte das regras atuais

As seguintes funcionalidades ou decisões não fazem parte da primeira versão e não deverão ser introduzidas na implementação sem uma decisão específica:

* criação de usuários adotantes;
* login para visitantes;
* agendamento de visitas;
* chat;
* integração com WhatsApp;
* notificações em tempo real;
* gerenciamento de voluntários;
* múltiplos níveis de administradores;
* status adicional para animais além de `AVAILABLE` e `ADOPTED`.

## Histórico de Revisões

| Data       | Versão | Alterações                                                                                                                     |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 06/08/2026 | 1.0    | Criação inicial do documento de regras de negócio.                                                                             |
| 11/08/2026 | 1.1    | Revisão e alinhamento das regras com requisitos, casos de uso e modelagem de dados.                                            |
| 02/09/2026 | 1.2    | Revisão geral e consolidação das regras de negócio, com alinhamento aos requisitos, casos de uso e decisões atuais do projeto. |
