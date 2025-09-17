# Mister Contador - Registro Contábil

## Visão Geral

Este projeto é uma aplicação Angular para registro e conciliação de lançamentos contábeis. A tela principal exibe uma lista de lançamentos, permitindo a visualização e a associação de contas de contrapartida.

## Como Executar

Para executar o projeto em um ambiente de desenvolvimento, siga os passos abaixo:

1.  **Navegue até o diretório do projeto:**
    ```bash
    cd MrV2
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    O projeto requer uma flag especial para ser compatível com versões mais recentes do Node.js. Use o seguinte comando:
    ```bash
    npm start
    ```

4.  **Abra a aplicação no navegador:**
    Acesse [http://localhost:4200](http://localhost:4200)

## Funcionalidades Implementadas

### 1. Lógica de Débito e Crédito

A tela de registro contábil exibe os lançamentos com a classificação correta de débito e crédito:
- **Pagamentos** (ex: Pagamento Fornecedor) são registrados como **débito**.
- **Recebimentos** (ex: Recebimento PIX) são registrados como **crédito**.

### 2. Conciliação de Contas (Lógica de Contrapartida)

Foi implementada a lógica para associar uma conta de contrapartida a um lançamento existente.

- **Como deveria funcionar:** Ao clicar em um lançamento na tabela, um modal ("Associar Conta Contábil") deveria ser aberto.
- **Funcionalidade:**
    - Se o lançamento original é um **débito**, o valor inserido no modal é salvo como **crédito** (a contrapartida).
    - Se o lançamento original é um **crédito**, o valor inserido no modal é salvo como **débito**.
- **Persistência:** As alterações são salvas em uma variável estática no componente para simular a persistência de dados durante a sessão do usuário. Em um ambiente de produção, isso seria substituído por uma chamada a uma API de backend.

### 3. Exibição Visual da Conciliação

A interface foi projetada para refletir o estado da conciliação:
- Um **ícone de livro** (`<i class="bx bx-book"></i>`) é exibido ao lado do valor de débito ou crédito para indicar que uma contrapartida foi associada.
- O valor da conta de contrapartida preenchido no modal é exibido na coluna correspondente (Débito ou Crédito).

## Problema Conhecido (Bug Crítico)

**O modal de conciliação não abre ao clicar.**

Atualmente, há um problema que impede a detecção ou o processamento de eventos de clique na tabela de lançamentos. Várias abordagens foram tentadas sem sucesso:
- Clique no ícone de livro.
- Clique na célula da tabela.
- Clique na linha inteira da tabela.
- Adição de um botão "Conciliar" explícito.

Nenhuma dessas interações conseguiu acionar a função `abrirModalConta()` para abrir o modal.

## Próximos Passos para Depuração

Como a interação com a página está bloqueada, a depuração precisa ser feita diretamente no código e no console do navegador. Sugestões:

1.  **Verificar a Sobreposição de Elementos (CSS):** Inspecione a tabela no navegador para garantir que não há nenhum elemento transparente ou com `z-index` maior cobrindo a área de clique.
2.  **Analisar a Propagação de Eventos:** Adicione `console.log` em diferentes níveis da árvore de componentes (na linha, na célula, no ícone) para ver até onde o evento de clique está sendo propagado antes de ser interrompido.
3.  **Isolar o Componente:** Crie uma página de teste simples com apenas a tabela de lançamentos para verificar se o problema é causado por algum outro componente ou estilo na página principal.
4.  **Revisar Bibliotecas de Terceiros:** Verifique se alguma das bibliotecas CSS ou JS (como Bootstrap ou Boxicons) está interferindo nos eventos de clique.