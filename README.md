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
  - Banco de dados
 
**Criando o server:**

  - Certifique-se de instalar o Node.Js - https://nodejs.org/en/download/
  - Abra um terminal e clone o repositório - https://github.com/JhonnyBn/TheLastMage.git
  - Instalar as dependências:
    - npm install 
    - npm install mocha
  - Digitar no terminal: npm start
  - Abrir outro terminal para o cliente e digitar o comando: npm start
  
**Comandos:**
  
  - reboot: Reinicia o jogo (deleta todos os jogadores).
  - chat [playerNameOrigin] [msg] -> Para mandar mensagem no chat. 
  - specialattack [playerNameOrigin] [playerNameTarget] -> Usar ataque especial contra outro jogador.
  - defend [playerNameOrigin] -> Se defender no turno.
  - attack [playerNameOrigin] [playerNameTarget] -> Atacar outro jogador.
  - Reset -> Resetar o jogo.
  - start -> Começar o jogo.
  - join [yourName] -> Para participar do jogo.
  - help -> Mostra todos os comandos do jogo.

**Testes:**

  - Instalar Mocha 
  - É importante que esteja na pasta do projeto 
  - Abra um terminal e digite o comando: mocha

