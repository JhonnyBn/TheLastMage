# The Last Mage
Um jogo baseado em turnos em que o vencedor é o último sobrevivente, desenvolvido para atender os requisitos da disciplina Sistemas Distribuídos no 6º período da graduação de Sistemas de Informação na UFU.

**Especificações:**

É um game baseado em turnos com 2 a 4 jogadores.\
Cada jogador pode, em seu turno, optar por:
  - Atacar outro jogador,
  - Defender,
  - Especial (ataque muito forte, limitado a 3 por partida)

O objetivo do jogo é derrotar todos os outros e ser o último sobrevivente.\
Para tanto, cada ataque causa 25 de dano no alvo escolhido, e o ataque especial causa 50 de dano.\
Cada jogador possui inicialmente 100 pontos de vida, e ao se proteger, não recebe dano até seu próximo turno.\
Versões futuras podem ter power-ups ou classes para mudar a habilidade especial dos jogadores.

**Componentes:**

  - 2 a 4 jogadores (clientes)
  - Servidor do jogo
  - Banco de dados próprio
 
**Criando o server:**

  - Certifique-se de instalar o Node.Js - https://nodejs.org/en/download/
  - Abra um terminal e clone o repositório - https://github.com/JhonnyBn/TheLastMage.git
  - Abra a pasta do servidor
    - `cd server`
  - Instalar as dependências:
    - `npm install`
  - Iniciar o server:
    - `npm start`
  - Siga a próxima seção para criar clientes
  
**Criando clientes (versão terminal):**

  - Certifique-se de instalar o Node.Js - https://nodejs.org/en/download/
  - Certifique-se que o servidor esteja rodando
  - Abra um terminal e clone o repositório - https://github.com/JhonnyBn/TheLastMage.git
  - Abra a pasta do cliente
    - `cd client`
  - Instalar as dependências:
    - `npm install`
  - Iniciar o client:
    - `npm start`
  - Abra quantos clientes quiser, um por terminal
  
**Criando clientes (versão web):**

  - Certifique-se de instalar o Node.Js - https://nodejs.org/en/download/
  - Certifique-se que o servidor esteja rodando
  - Abra um terminal e clone o repositório - https://github.com/JhonnyBn/TheLastMage.git
  - Abra a pasta do cliente web
    - `cd client-web/public_front/`
  - Abra o arquivo do cliente-web no seu navegador preferido e bom jogo!
  - Abra quantos clientes quiser, um por aba
  
**Comandos:**
  
  - reboot: Reinicia o jogo (deleta todos os jogadores).
  - chat [msg] -> Para mandar mensagem no chat. 
  - specialattack [TargetPlayerName] -> Usar ataque especial contra outro jogador.
  - defend -> Se defender no turno.
  - attack [TargetPlayerName] -> Atacar outro jogador.
  - Reset -> Resetar o jogo.
  - start -> Começar o jogo.
  - join -> Para participar do jogo.
  - help -> Mostra todos os comandos do jogo.

**Testes:**

  - Certifique-se de instalar o Node.Js - https://nodejs.org/en/download/
  - Abra um terminal e clone o repositório - https://github.com/JhonnyBn/TheLastMage.git
  - Abra a pasta do servidor:
    - `cd server`
  - Instalar as dependências:
    - `npm install`
  - Iniciar os testes:
    - `npm test`

