# Guia de estudo — Prova Full Stack II (Kanban)

Este guia compara **o código-fonte do professor** (`EdwynWs/codigoFonte`) com a **prova** (`EdwynWs/provaFullstack22`). As correções mantêm a estratégia ensinada: componente reutilizável, `ApiClient`, `useRef`, `useState`, `useEffect`, `router`, `toast`, `Link`, layout e rotas do Next.

> Aviso: o projeto original é material didático. O backend usa senha em texto simples e segredo JWT embutido no código; não publique essas configurações como produto real.

## 1. Requisitos e execução

1. Instale Node.js compatível com Next 15, npm e MySQL.
2. Caso não tenha o banco da prova, execute `backend/db/schema_estudo.sql` em uma base MySQL **local de estudo**. O arquivo cria o banco `test`, exatamente como está definido em `backend/db/database.js`. Revise antes de executar se já utiliza esse banco para outros projetos.
3. Em `prova-kanban/backend`: `npm install` e `npm start`. API: http://localhost:5000 ; Swagger: http://localhost:5000/docs
4. Em outro terminal, em `prova-kanban/frontend`: `npm install` e `npm run dev`. Interface: http://localhost:3000
5. Login de teste da base opcional: `admin@kanban.com`, senha `123456`. Se utilizar o banco já fornecido pelo professor, use as credenciais dele.

Se o seu MySQL requer senha, ajuste **somente no ambiente de estudo** a conexão em `backend/db/database.js` ou use um usuário local com as permissões adequadas.

**Observação:** o repositório original contém pastas `node_modules` versionadas. Elas não são necessárias para entender o código; reinstale as dependências nas pastas backend/frontend.

## 2. Onde ficam as páginas

| URL | Arquivo |
| --- | --- |
| `/login` | `frontend/app/login/page.jsx` |
| `/tarefas` | `frontend/app/tarefas/page.jsx` (Dashboard) |
| `/tarefas/quadro` | `frontend/app/tarefas/quadro/page.jsx` |
| `/tarefas/kanban` | `frontend/app/tarefas/kanban/page.jsx` (Gerenciar) |
| `/tarefas/kanban/cadastrar` | `frontend/app/tarefas/kanban/cadastrar/page.jsx` |
| `/tarefas/kanban/alterar/5` | `frontend/app/tarefas/kanban/alterar/[id]/page.jsx` |
| `/tarefas/usuarios` | `frontend/app/tarefas/usuarios/page.jsx` |

A pasta literal `[id]` é indispensável para que o Next entregue o parâmetro da URL.

## 3. Qual rota utilizar? Origem no backend da prova

| O que fazer | Método e URL | Onde aparece no frontend |
| --- | --- | --- |
| Login | `POST /auth/login` | `login/page.jsx` |
| Ver usuário logado | `GET /auth/cookie` | `userContext.jsx` |
| Resumo do Dashboard | `GET /tarefas/resumo` | `tarefas/page.jsx` |
| Listar tarefas | `GET /tarefas` | `quadro/page.jsx` e `kanban/page.jsx` |
| Obter uma tarefa | `GET /tarefas/:id` | `alterar/[id]/page.jsx` |
| Cadastrar | `POST /tarefas` | `formTarefa.jsx` |
| Alterar cadastro | `PUT /tarefas/:id` | `formTarefa.jsx` |
| Mover coluna | `PATCH /tarefas/:id/status` | `quadro/page.jsx` |
| Excluir | `DELETE /tarefas/:id` | `kanban/page.jsx` |
| Listar responsáveis | `GET /usuarios` | `formTarefa.jsx` e `usuarios/page.jsx` |

Essas rotas foram confirmadas em `backend/server.js`, `routes/tarefaRoute.js`, `routes/authRoute.js` e `routes/usuarioRoute.js`.

## 4. Comparando cada item da correção (0 a 10 pontos)

### Dashboard — 2 pontos

**Problema original:** endpoint errado, resposta descartada, cards estáticos.

**Solução:** `useEffect` chama `carregarResumo()`, que faz `ApiClient.get("tarefas/resumo")`; `setResumo(response)` guarda o objeto e o JSX usa `resumo.a_fazer`, `resumo.em_andamento`, `resumo.em_revisao`, `resumo.concluido`.

Resposta esperada de exemplo:

```json
{"a_fazer":3,"em_andamento":3,"em_revisao":3,"concluido":3}
```

**Conexão com o professor:** é o mesmo padrão `useState` + `useEffect` + `ApiClient.get` + `return` de `admin/imovel/page.jsx`. **Novidade:** o retorno é um objeto de contagens, não uma lista de imóveis.

### Quadro Kanban — 4 pontos

**Problema original:** GET existente, mas não havia distribuição por status nem dados nos cards ou PATCH.

**Solução:** carrega `GET /tarefas` para `useState([])`; em cada coluna executa `tarefas.filter(item => item.status === coluna.chave)`; depois `.map()` para desenhar `CardTarefa`. Cada card exibe título, descrição, data e `tarefa.responsavel?.nome`.

**Movimentação:** setas ou arrastar/soltar fazem `ApiClient.patch("tarefas/" + id + "/status", {status: novoStatus})`. Após sucesso, `setTarefas(...map(...))` coloca a tarefa na coluna nova.

**Conexão com o professor:** `CardTarefa` reaproveita o conceito de `CardImovel`, e `carregarTarefas` reaproveita `carregarImoveis`. **Novidades:** `filter` por status, drag-and-drop, botões de movimentação, `PATCH`, atualização do estado da lista.

### Gerenciar Tarefas — 3 pontos

**Problema original:** formulário baseado em arquivo/imóvel, endpoint de alteração errado, rota sem `[id]`.

**Solução:** `FormTarefa` permanece reutilizável, como `FormImovel`. Recebe `tarefa` na edição, usa `useEffect` para preencher `useRef`, e o botão faz `onClick={alteracao ? alterar : gravar}`. O cadastro envia JSON para `POST /tarefas`. A edição recebe o ID da rota dinâmica, chama `GET /tarefas/:id` e envia JSON para `PUT /tarefas/:id`. A exclusão usa `DELETE /tarefas/:id` e recarrega a lista.

Corpo exigido pela API:

```json
{
  "titulo":"Estudar useEffect",
  "descricao":"Praticar formulário no Next",
  "status":"a_fazer",
  "dataLimite":"2026-11-25",
  "responsavel":{"id":1}
}
```

O responsável pode ser `null` no backend. Não envie `responsavel: 1` nem `responsavel: "João"`.

**Conexão com o professor:** reutiliza diretamente o padrão das páginas `admin/imovel/cadastrar/page.jsx`, `admin/imovel/alterar/[id]/page.jsx`, `components/formImovel.jsx` e `admin/imovel/page.jsx`. **Novidades:** JSON em lugar de FormData, seleção de usuário com GET, e ID obrigatoriamente na URL do PUT.

### Controle de acesso — 1 ponto

O `proxy.js` existente já protege `/tarefas/:path*` verificando o cookie `token`. Ele foi mantido. O `UserContext` foi corrigido para consultar `auth/cookie` e o Provider foi colocado dentro do `<body>` raiz, sem `html/body` aninhados.

**Importante:** proxy no frontend **não substitui** a validação no backend. O backend continua exigindo o middleware de autenticação em todas as rotas de tarefas.

## 5. Mapa do que foi reaproveitado

| Professor: `codigoFonte` | Prova completada | Adaptação |
| --- | --- | --- |
| `client/utils/apiClient.js` | `frontend/utils/apiClient.js` | GET/POST/PUT/DELETE preservados; PATCH incluído; leitura de erro corrigida |
| `client/app/context/userContext.jsx` | `frontend/app/tarefas/context/userContext.jsx` | `login/usuario` trocado por `auth/cookie` |
| `client/app/admin/layout.jsx` | `frontend/app/tarefas/layout.jsx` | Menu único compartilhado |
| `client/app/admin/imovel/page.jsx` | `frontend/app/tarefas/kanban/page.jsx` | Lista/editar/excluir agora usam tarefas |
| `client/app/admin/imovel/cadastrar/page.jsx` | `frontend/app/tarefas/kanban/cadastrar/page.jsx` | Reutiliza o formulário |
| `client/app/admin/imovel/alterar/[id]/page.jsx` | `frontend/app/tarefas/kanban/alterar/[id]/page.jsx` | Busca ID e passa tarefa ao formulário |
| `client/app/components/formImovel.jsx` | `frontend/app/components/formTarefa.jsx` | Campos e payload da tarefa; sem imagens |
| `client/app/components/cardImovel.jsx` | `frontend/app/components/cardTarefa.jsx` | Dados reais + controles de movimentação |

O professor não forneceu no código de imóveis a lógica de dashboard por status, o quadro distribuído em colunas, o `filter` de tarefas ou a movimentação por `PATCH`: essas partes tiveram de ser desenvolvidas especificamente para a prova.

## 6. Por que ocorreram os erros que vimos no estudo

- **400 Bad Request:** tentativa de enviar `FormData` ao endpoint JSON de tarefas; o backend usa `express.json()`.
- **`dados is not defined`:** a variável não foi declarada antes de passar ao `ApiClient.post`.
- **`Objects are not valid as a React child`:** o responsável é objeto; para exibir, use `tarefa.responsavel?.nome`.
- **`endereco is not defined`:** referência do formulário de imóveis foi copiada sem adaptação.
- **Erro do Provider:** `useContext(UserContext)` precisa de `<UserProvider>` acima na árvore de componentes.
- **Edição não abre:** a URL `/alterar/5` requer uma pasta chamada literalmente `[id]`.
- **Status não muda:** não basta alterar o texto do card: é preciso chamar `PATCH /tarefas/:id/status`.

## 7. Roteiro de teste manual

1. Faça login, confirme que a tela Dashboard carrega e apresenta quatro contagens.
2. Abra o Quadro, confira a distribuição das tarefas pelas quatro colunas.
3. Use a seta para mover uma tarefa e recarregue a página: ela deve permanecer na coluna nova.
4. Arraste uma tarefa entre as colunas no computador e confirme a persistência.
5. Abra Gerenciar Tarefas e crie uma nova tarefa usando um responsável existente.
6. Edite a tarefa pela URL `/tarefas/kanban/alterar/ID`, altere título e data, salve e confira a listagem.
7. Exclua a tarefa e confirme que desapareceu da listagem e das contagens do Dashboard.
8. Limpe o cookie `token` e navegue para `/tarefas`: o proxy deve redirecionar para o login.

Se algo falhar, confira **F12 > Network > Response**, o método HTTP e o corpo enviado, além do Swagger em http://localhost:5000/docs.

## 8. Exercícios de revisão

1. De onde vem a string `"tarefas/resumo"` usada em `ApiClient.get`?
2. Por que usamos `useState([])` para listar tarefas e `useState({})` (ou objeto inicial) para as contagens?
3. Qual a diferença de `tarefas.filter(...)` para `tarefas.map(...)`?
4. Por que o cadastro usa `post` e não `postFormData`?
5. Por que `responsavel` deve receber `{id: 1}`, mas o JSX exibe `responsavel.nome`?
6. O que a pasta `[id]` faz no Next App Router?
7. Em qual arquivo o `PATCH` deve ser chamado?
8. Qual é a função do `useEffect` no `FormTarefa` durante a edição?
9. O que significa `onClick={alteracao ? alterar : gravar}`?
10. Se a tarefa muda de status, por que a contagem do Dashboard só atualiza depois de entrar/atualizar a página?

**Gabarito resumido:** (1) backend/routes/tarefaRoute.js; (2) lista versus objeto; (3) selecionar registros versus transformar cada registro em JSX; (4) API exige application/json; (5) contrato de entrada versus objeto de resposta; (6) recebe parte dinâmica da URL; (7) Quadro; (8) preenche refs; (9) escolhe a função conforme o modo; (10) o dashboard consulta o resumo ao montar, não faz atualização em tempo real.

---

**Limites de validação:** esta implementação foi construída a partir dos dois repositórios e do contrato do backend; para afirmar que está 100% operacional em sua máquina, ainda é necessário executar o roteiro acima com seu MySQL e o backend ligados. A nota final depende da rubrica completa do professor.
