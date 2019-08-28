# The Last Mage
Um jogo baseado em turnos em que o vencedor é o último sobrevivente, desenvolvido para atender os requisitos da disciplina Sistemas Distribuídos no 6º período da graduação de Sistemas de Informação na UFU.

**Especificações:**

É um game baseado em turnos com 2 a 4 jogadores.\
Cada jogador pode, em seu turno, optar por:
  - Atacar outro jogador,
  - Defender,
  - Especial (ataque muito forte, limitado a 3 por partida)
O objetivo do jogo é derrotar todos os outros e ser o último sobrevivente.
Os jogadores podem usar qualquer política ou estratégia, como múltiplos atacando o mesmo alvo, formação de times e/ou traições.
Para formar tais estratégias, teremos um sistema de chat incorporado.
Versões futuras podem ter power-ups ou classes para mudar o especial dos jogadores.

**Componentes:**

  - 2 a 4 jogadores (clientes)
  - Servidor do jogo
  - Servidor de chat
  - Banco de dados

**Testes a serem implementados:**

  - Teste de concorrência: demonstrando que múltiplos clientes podem acessar o serviço ao mesmo tempo, sem comportamentos estranhos.
  - Teste de recuperação de falhas: quando um componente falha e volta a executar, ele não leva o sistema a nenhum estado inesperado.
  - Demonstração de funcionalidades: Mostrar que as funcionalidades estão implementadas. Os jogadores devem ser capazes de atacar e de defender.
