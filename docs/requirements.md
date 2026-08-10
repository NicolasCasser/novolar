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
- Filtros por características;
- Página de detalhes do animal;
- Formulário para manifestação de interesse em adoção.

### Área Administrativa

- Autenticação de administradores;
- Cadastro de animais;
- Edição de animais;
- Exclusão de animais;
- Atualização do status de adoção;
- Visualização das solicitações recebidas;
- Atualização do status das solicitações.

---

## 5. Atores

| Ator | Descrição |
|------|-----------|
| Visitante | Usuário não autenticado que pode consultar os animais disponíveis e registrar interesse em adoção. |
| Administrador | Usuário autenticado responsável pelo gerenciamento dos animais e das solicitações de adoção. |

---

## 6. Requisitos Funcionais

| Código | Requisito | Prioridade |
|---------|-----------|------------|
| RF01 | O sistema deve exibir um catálogo público de animais disponíveis para adoção. | Must |
| RF02 | O sistema deve permitir pesquisar animais por nome. | Must |
| RF03 | O sistema deve permitir filtrar animais por espécie, porte, sexo, idade, estado e cidade. | Must |
| RF04 | O sistema deve exibir uma página de detalhes contendo todas as informações do animal. | Must |
| RF05 | O visitante deve poder enviar uma solicitação de interesse em adoção. | Must |
| RF06 | O administrador deve autenticar-se utilizando login e senha. | Must |
| RF07 | O administrador deve cadastrar animais. | Must |
| RF08 | O administrador deve editar animais cadastrados. | Must |
| RF09 | O administrador deve excluir animais cadastrados. | Must |
| RF10 | O administrador deve atualizar o status do animal (Disponível e Adotado.). | Must |
| RF11 | O administrador deve visualizar todas as solicitações de adoção. | Must |
| RF12 | O administrador deve atualizar o status das solicitações (Pendente, Aprovada e Recusada). | Must |
| RF13 | O sistema deve armazenar um histórico básico das solicitações de adoção. | Should |
| RF14 | O sistema deve permitir o cadastro de múltiplas imagens para cada animal. | Should |
| RF15 | O catálogo de animais deve possuir paginação. | Should |
| RF16 | O catálogo deve permitir ordenação por data de cadastro e idade. | Should |
| RF17 | O sistema deve enviar uma confirmação de solicitação de adoção por e-mail. | Should |
| RF18 | O administrador deve visualizar indicadores básicos sobre animais e solicitações. | Could |
| RF19 | O administrador deve pesquisar solicitações pelo nome do interessado ou do animal. | Could |
| RF20 | O sistema deve permitir o gerenciamento de voluntários. | Won't |

---

## 7. Requisitos Não Funcionais

### Usabilidade

| Código | Requisito |
|---------|-----------|
| RNF01 | A interface deverá ser responsiva para dispositivos móveis, tablets e desktops. |
| RNF02 | A navegação deverá ser simples, intuitiva e consistente entre as páginas. |
| RNF03 | Os formulários deverão apresentar mensagens claras de validação e erro. |

### Acessibilidade

| Código | Requisito |
|---------|-----------|
| RNF04 | As páginas deverão possuir contraste adequado entre texto e fundo. |
| RNF05 | As imagens deverão possuir texto alternativo quando aplicável. |
| RNF06 | A navegação deverá ser possível utilizando apenas o teclado. |

### Segurança

| Código | Requisito |
|---------|-----------|
| RNF07 | As senhas deverão ser armazenadas utilizando algoritmo de hash seguro (bcrypt). |
| RNF08 | O acesso às funcionalidades administrativas deverá ser protegido por autenticação JWT. |
| RNF09 | Todas as entradas de dados deverão ser validadas antes do processamento. |
| RNF10 | Apenas usuários autenticados poderão acessar funcionalidades administrativas. |

### Privacidade

| Código | Requisito |
|---------|-----------|
| RNF11 | O sistema deverá armazenar apenas os dados necessários para o processo de adoção. |
| RNF12 | Os dados fornecidos pelos interessados deverão ser acessíveis apenas aos administradores. |

### Performance

| Código | Requisito |
|---------|-----------|
| RNF13 | As consultas ao catálogo deverão responder em até 2 segundos em condições normais de uso. |
| RNF14 | O sistema deverá suportar múltiplos acessos simultâneos compatíveis com o contexto acadêmico do projeto. |

### Qualidade

| Código | Requisito |
|---------|-----------|
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
- Sistema de notificações em tempo real.

---

## 9. Premissas e Restrições

### Premissas

- O sistema será desenvolvido utilizando NestJS no back-end e React no front-end.
- O banco de dados utilizado será PostgreSQL.
- A autenticação será baseada em JWT.
- O projeto utilizará Docker para padronização do ambiente de desenvolvimento.
- O código-fonte será versionado utilizando Git.

### Restrições

- O projeto deverá utilizar apenas dados fictícios ou previamente autorizados.
- O sistema deverá atender aos requisitos definidos pela disciplina de Engenharia de Software III e Programação Back-End.
- O desenvolvimento deverá ser concluído dentro do cronograma acadêmico estabelecido.
- A solução deverá utilizar arquitetura multicamadas com persistência em banco de dados relacional.

---

## 10. Histórico de Revisões

| Data | Versão | Alterações |
|------|--------|------------|
| 27/07/2026 | 1.0 | Criação inicial do documento de requisitos. |