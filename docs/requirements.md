# Requisitos do Sistema

## 1. Visão Geral

A Plataforma Web para Adoção Responsável e Gestão de Animais Resgatados tem como objetivo facilitar o processo de adoção de animais por meio de uma aplicação web que permita a divulgação de animais disponíveis e o gerenciamento das solicitações de adoção.

O sistema será composto por uma área pública, destinada à consulta dos animais e ao registro de interesse em adoção, e por uma área administrativa, responsável pelo gerenciamento dos animais cadastrados e das solicitações recebidas.

O projeto será desenvolvido como parte das disciplinas de Engenharia de Software III e Programação Back-End da Universidade Católica de Pelotas (UCPel).

---

## 2. Objetivo

Desenvolver uma aplicação web que auxilie organizações ou protetores independentes no gerenciamento de animais resgatados, oferecendo um catálogo público de animais disponíveis para adoção e uma área administrativa para controle dos cadastros e das solicitações de adoção.

---

## 3. Público-Alvo

O sistema é destinado aos seguintes públicos:

- Organizações não governamentais (ONGs) de proteção animal;
- Protetores independentes de animais;
- Pessoas interessadas em adotar um animal.

---

## 4. Escopo

A primeira versão do sistema contempla:

### Área Pública

- Visualização do catálogo de animais disponíveis;
- Pesquisa de animais por nome;
- Filtros por espécie, porte, sexo, idade, estado e cidade;
- Ordenação dos animais;
- Paginação do catálogo;
- Página de detalhes do animal;
- Formulário para manifestação de interesse em adoção.

### Área Administrativa

- Autenticação de administradores;
- Visualização de indicadores básicos;
- Cadastro de animais;
- Edição de animais;
- Exclusão lógica de animais;
- Gerenciamento das imagens dos animais;
- Visualização das solicitações de adoção;
- Atualização do status das solicitações;
- Gerenciamento do processo de adoção.

Funcionalidades classificadas como `Should` ou `Could` poderão ser implementadas conforme disponibilidade de tempo e prioridade durante o desenvolvimento.

---

## 5. Atores

| Ator | Descrição |
| --- | --- |
| Visitante | Usuário não autenticado que pode consultar os animais disponíveis e registrar interesse em adoção. |
| Administrador | Usuário autenticado responsável pelo gerenciamento dos animais e das solicitações de adoção. |

---

## 6. Requisitos Funcionais

| Código | Requisito | Prioridade |
| --- | --- | --- |
| RF01 | O sistema deve exibir um catálogo público contendo os animais disponíveis para adoção. | Must |
| RF02 | O sistema deve permitir pesquisar animais pelo nome. | Must |
| RF03 | O sistema deve permitir filtrar animais por espécie, porte, sexo, idade, estado e cidade. | Must |
| RF04 | O sistema deve permitir ordenar os animais por data de cadastro e idade. | Should |
| RF05 | O catálogo de animais deve possuir paginação. | Should |
| RF06 | O sistema deve exibir uma página de detalhes contendo as informações públicas do animal e suas imagens. | Must |
| RF07 | O visitante deve poder enviar uma solicitação de interesse em adoção para um animal disponível. | Must |
| RF08 | O sistema deve validar os dados informados na solicitação antes de registrá-la. | Must |
| RF09 | O sistema deve enviar uma confirmação da solicitação de adoção por e-mail. | Should |
| RF10 | O administrador deve autenticar-se utilizando e-mail e senha. | Must |
| RF11 | O administrador deve cadastrar animais informando todos os dados obrigatórios. | Must |
| RF12 | O administrador deve cadastrar pelo menos uma imagem para cada animal. | Must |
| RF13 | O sistema deve permitir o cadastro de até cinco imagens para cada animal. | Should |
| RF14 | O sistema deve permitir definir exatamente uma imagem principal para cada animal. | Must |
| RF15 | O administrador deve editar os dados dos animais cadastrados. | Must |
| RF16 | O administrador deve realizar a exclusão lógica de animais. | Must |
| RF17 | O sistema deve permitir visualizar e gerenciar as solicitações de adoção recebidas. | Must |
| RF18 | O administrador deve alterar o status das solicitações de adoção conforme o fluxo definido pelo sistema. | Must |
| RF19 | O sistema deve permitir os status `PENDING`, `IN_ANALYSIS`, `APPROVED`, `REJECTED` e `CANCELED` para as solicitações de adoção. | Must |
| RF20 | O sistema deve alterar automaticamente o status do animal para `ADOPTED` quando uma solicitação for aprovada. | Must |
| RF21 | O sistema deve alterar automaticamente para `CANCELED` as solicitações `PENDING` ou `IN_ANALYSIS` relacionadas ao mesmo animal quando uma solicitação for aprovada. | Must |
| RF22 | O sistema deve impedir o registro de novas solicitações para animais com status `ADOPTED`. | Must |
| RF23 | O sistema deve preservar as solicitações de adoção após sua aprovação, rejeição ou cancelamento. | Must |
| RF24 | O sistema deve validar se a cidade informada pertence ao estado selecionado utilizando os dados oficiais disponibilizados pelo IBGE. | Must |
| RF25 | O administrador deve visualizar indicadores básicos sobre animais e solicitações. | Could |
| RF26 | O administrador deve poder pesquisar solicitações pelo nome do interessado ou do animal. | Could |
| RF27 | O sistema deve permitir o gerenciamento de voluntários. | Won't |

### Dados obrigatórios dos animais

Para o cadastro de um animal, o sistema deverá exigir:

- Nome;
- Espécie;
- Raça;
- Sexo;
- Porte;
- Cor;
- Idade;
- Estado;
- Cidade;
- Descrição;
- Informação sobre vacinação;
- Informação sobre castração;
- Pelo menos uma imagem.

Quando a raça do animal não for conhecida, deverá ser utilizado `SRD (Sem Raça Definida)`.

A idade poderá ser informada em anos ou meses, mas deverá ser armazenada internamente em meses.

---

## 7. Requisitos Não Funcionais

### Usabilidade

| Código | Requisito |
| --- | --- |
| RNF01 | A interface deverá ser responsiva para dispositivos móveis, tablets e desktops. |
| RNF02 | A navegação deverá ser simples, intuitiva e consistente entre as páginas. |
| RNF03 | Os formulários deverão apresentar mensagens claras de validação e erro. |

### Acessibilidade

| Código | Requisito |
| --- | --- |
| RNF04 | As páginas deverão possuir contraste adequado entre texto e fundo. |
| RNF05 | As imagens deverão possuir texto alternativo quando aplicável. |
| RNF06 | A navegação deverá ser possível utilizando apenas o teclado. |

### Segurança

| Código | Requisito |
| --- | --- |
| RNF07 | As senhas deverão ser armazenadas utilizando algoritmo de hash seguro (`bcrypt`). |
| RNF08 | O acesso às funcionalidades administrativas deverá ser protegido por autenticação JWT. |
| RNF09 | Todas as entradas de dados deverão ser validadas antes do processamento. |
| RNF10 | Apenas usuários autenticados poderão acessar funcionalidades administrativas. |

### Privacidade

| Código | Requisito |
| --- | --- |
| RNF11 | O sistema deverá armazenar apenas os dados necessários para o processo de adoção. |
| RNF12 | Os dados fornecidos pelos interessados deverão ser acessíveis apenas aos administradores autenticados. |

### Performance

| Código | Requisito |
| --- | --- |
| RNF13 | As consultas ao catálogo deverão responder em até 2 segundos em condições normais de uso. |
| RNF14 | O sistema deverá suportar múltiplos acessos simultâneos compatíveis com o contexto acadêmico do projeto. |

### Qualidade

| Código | Requisito |
| --- | --- |
| RNF15 | O sistema deverá utilizar arquitetura multicamadas. |
| RNF16 | O projeto deverá utilizar controle de versão com Git. |
| RNF17 | O sistema deverá possuir testes unitários para as principais regras de negócio e testes de integração para os principais fluxos da aplicação. |
| RNF18 | O sistema deverá utilizar banco de dados relacional PostgreSQL. |

---

## 8. Itens Fora do Escopo

As funcionalidades abaixo não fazem parte da primeira versão do sistema:

- Cadastro de usuários adotantes;
- Login para usuários públicos;
- Agendamento de visitas;
- Chat entre administradores e interessados;
- Assinatura digital de documentos;
- Integração com WhatsApp;
- Integração com redes sociais;
- Sistema de notificações em tempo real;
- Gerenciamento de voluntários;
- Múltiplos níveis de administradores.

---

## 9. Premissas e Restrições

### Premissas

- O sistema será desenvolvido utilizando NestJS no back-end e React com Vite no front-end.
- O banco de dados utilizado será PostgreSQL.
- A autenticação será baseada em JWT.
- O projeto utilizará Docker para padronização do ambiente de desenvolvimento.
- O código-fonte será versionado utilizando Git.
- Os estados e municípios utilizados nas validações de localização serão obtidos por meio da API oficial do IBGE.

### Restrições

- O projeto deverá utilizar apenas dados fictícios ou previamente autorizados.
- O sistema deverá atender aos requisitos definidos pelas disciplinas de Engenharia de Software III e Programação Back-End.
- O desenvolvimento deverá ser concluído dentro do cronograma acadêmico estabelecido.
- A solução deverá utilizar arquitetura multicamadas com persistência em banco de dados relacional.

---

## 10. Histórico de Revisões

| Data | Versão | Alterações |
| --- | --- | --- |
| 27/07/2026 | 1.0 | Criação inicial do documento de requisitos. |
| 12/08/2026 | 1.1 | Revisão dos requisitos para alinhamento com as regras de negócio, casos de uso e modelagem de dados. |