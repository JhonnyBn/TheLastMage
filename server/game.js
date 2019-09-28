var helpText =
  "The current commands are:\n" +
  "join <yourName>\t\t\tTo join the game\n" +
  "start\t\t\t\t\tTo start the game\n" +
  "attack <player>\t\t\tTo attack other player\n" +
  "specialattack <player>\tTo use special attack on other player\n" +
  "defend\t\t\t\t\tTo defend yourself this turn\n" +
  "help\t\t\t\t\tTo display this list of commands.\n";

// Classe do mago, basicamente o player
class mage {
  constructor(name, sender) {
    this.name = name;
    this.sender = sender;
    this.life = 100;
    this.alive = 1;
    this.attackDamage = 25;
    this.specialDamage = 50;
    this.defending = 0;
    this.specialAttacksLeft = 3;
  }
  
  reset() {
    this.life = 100;
    this.alive = 1;
    this.attackDamage = 25;
    this.specialDamage = 50;
    this.defending = 0;
    this.specialAttacksLeft = 3;
  }

  checkLife() {
    if (this.life <= 0) {
      this.sender.sendMsgToAll(this.name + " just died.\n");
      this.alive = 0;
    } else {
      this.sender.sendMsgToAll(
        this.name + " has now " + this.life + " life.\n"
      );
    }
  }

  // Ataca um jogador,
  // retorna 1 se obteve sucesso, 0 caso contrário
  attack(target) {
    if (target.isValid()) {
      target.life -= this.attackDamage;
      return 1;
    }
    return 0;
  }

  // Ataca um jogador com o especial,
  // retorna 1 se obteve sucesso, 0 caso contrario
  specialAttack(target) {
	  
	this.specialAttacksLeft -= 1;
	
	if ( target.isValid() ) {
		target.life -= this.specialDamage;
		return 1;
	}
	
	return 0;
  }

  // Defende para nao ser atacado por um turno
  defend() {
    this.defending = 1;
  }

  // A cada turno a defesa deve ser resetada
  disableShield() {
    this.defending = 0;
  }

  // Verifica se o jogador eh um alvo valido
  // Ele eh valido se nao estiver defendendo
  isValid() {
    return !this.defending && this.alive;
  }

  // Realiza uma acao com base no comando (action) e alvo (target)
  takeAction(action, target) {
	  
    switch (action) {
		
      case "attack":
	  
        this.sender.sendMsgToAll(
          this.name + " is attacking " + target.name + "..."
        );
        if (this.attack(target)) {
          this.sender.sendMsgToAll(
            "Success! Dealt " + this.attackDamage + " damage."
          );
          target.checkLife();
        } else {
          this.sender.sendMsgToAll("Fail! He or she blocked the attack.");
        }

		return 1;
        break;
		
      case "specialattack":
	  
		this.sender.sendMsgToAll(
			this.name + " is using special attack on " + target.name + "..."
		);
		
		if ( this.specialAttack(target) ) {
			this.sender.sendMsgToAll(
				"Success! Dealt " + this.specialDamage + " damage."
			);
			target.checkLife();
		}
		else {
			this.sender.sendMsgToAll("Fail! He or she blocked the special attack.");
		}
		
		return 1;
        break;
		
      case "defend":
	  
        this.defend();
        this.sender.sendMsgToCurrentClient("Defending until next turn.");
		this.sender.sendMsgToAllButIgnoreCurrentClient(this.name + " is defending until next turn.");
		
        return 1;
        break;
		
      default:
	  
        this.sender.sendMsgToCurrentClient("This is not a valid command. Type 'help' for display the current commands.");
		
        return 0;
        break;
    }
  }
}

// classe do jogo, basicamente o controlador dos players
module.exports = class game {
  constructor(sender) {
    this.sender = sender;
    this.players = [];
    this.turn = 0;
    this.currentPlayer = null;
    this.running = 0;
  }

  // Inicia o jogo
  run() {
    this.running = 1;
    this.setNextPlayer();
  }
  
  // Reseta o jogo
  resetGame() {
	  for( var player of this.players ) {
		  player.reset();
	  }
	  this.turn = 0;
	  this.currentPlayer = null;
	  this.running = 0;
	  this.sender.sendMsgToAll("The game has been reset.\nSay 'start' to begin a new game.\n");
  }
  
  // Retorna True se haver somente um jogador vivo
  isGameFinished() {
	  let nPlayersAlive = 0;
	  for( var player of this.players ) {
		  if( player.alive ) nPlayersAlive += 1;
	  }
	  return ( nPlayersAlive < 2 )
  }
  
  // Parabeniza o vencedor do jogo
  congratulateWinner() {
	  for( var player of this.players ) {
		  if( player.alive ) {
			  this.sender.sendMsgToAll("Congratulations " + player.name + "! You won the game!\n");
			  return;
		  }
	  }
  }

  // Adiciona um novo jogador
  addPlayer(name) {
    // Se o nome ja existe, nao adiciona
    if (this.getPlayerByName(name)) {
      this.sender.sendMsgToCurrentClient(
        "Name already in use. Please choose another."
      );
      return;
    }

    this.players.push(new mage(name, this.sender));
    this.sender.sendMsgToCurrentClient("Welcome to the game, " + name + "!\n");
    this.sender.sendMsgToAllButIgnoreCurrentClient(name + " joined the game");
  }

  // Retorna um jogador com base em seu NAME
  getPlayerByName(name) {
    for (var mago of this.players) {
      if (mago.name == name) return mago;
    }
  }

  // Reseta os escudos dos jogadores
  disableShields() {
    for (var player of this.players) {
      player.disableShield();
    }
  }

  // Prepara a proxima rodada
  setNextPlayer() {
    let nplayers = this.players.length;
    this.currentPlayer = this.players[
      ((this.turn % nplayers) + nplayers) % nplayers
    ];
    this.turn += 1;
    this.currentPlayer.disableShield();
	
	// Se o jogador morreu, verifica se o jogo acabou
	// Caso tenha acabado, reinicia o jogo
	// Caso ainda nao tenha acabado, continua
    if ( !this.currentPlayer.alive ) {
		if ( this.isGameFinished() ) {
			this.congratulateWinner();
			this.resetGame();
		}
		else this.setNextPlayer();
	}
  }

  // Processa o texto de input para realizar as acoes do jogo
  processInput(input) {
    console.log(input)
    input = input.split(" ");
    let player = input[0];
    let command = input[1];
    let param = input[2];

	switch( command ) {
		
		// Jogador registrando
		case 'join':
		
			// Ja esta registrado
			if ( player !== "new" ) {
				this.sender.sendMsgToCurrentClient(
				  "You are already in the game, " + player + "!\n"
				);
				break;
			}
			
			// Nao colocou o nome
			if ( !param ) {
				this.sender.sendMsgToCurrentClient(
				  'To join the game, please say "join <yourName>"'
				);
				break;
			}
			
			// Adiciona o player
			this.addPlayer(param);
			
			break;
			
		// Solicitacao de comandos
		case 'help':
		
			this.sender.sendMsgToCurrentClient(helpText);
			
			break;
			
		// Comecar o jogo
		case 'start':
		
			if ( !this.running ) {
				this.run();
				this.sender.sendMsgToAll("The game has started!\n");
			}
			
			break;
		
		// Recomecar o jogo
		case 'reset':
			
			this.resetGame();
			
			break;
		
		// Comandos de ataque e defesa
		case 'attack':
		case 'specialattack':
		case 'defend':
			
			// Se o jogo nao tiver comecado
			if( !this.running ) {
				this.sender.sendMsgToCurrentClient(
					'Please start the game, or type "help" for the commands information.'
				);
				break;
			}
			
			// No turno do jogador
			if (player == this.currentPlayer.name) {
				
				// Verifica se o alvo eh valido
				let target = null;
				if (command !== "defend") {
					target = this.getPlayerByName(param);
					if (target == null || !target.alive) {
						this.sender.sendMsgToCurrentClient("Please insert a valid target.");
						break;
					}
				}
				
				// Verifica se o jogador pode usar ataques especiais
				if ( command === 'specialattack' ) {
					if ( this.currentPlayer.specialAttacksLeft < 1 ) {
						this.sender.sendMsgToCurrentClient("You can't use more special attacks this game.")
						break;
					}
				}

				// O jogador realiza a acao com alvo do parametro
				// Se der certo, passa para o proximo turno
				if ( this.currentPlayer.takeAction(command, target) ) {
					this.setNextPlayer();
				}
			}
			// Nao esta no turno do jogador
			else {
				// Se o jogador estiver morto
				if (!this.getPlayerByName(player).alive) {
					this.sender.sendMsgToCurrentClient(
						"You are dead. Please wait for the game to finish or start a new game."
					);
				}
				else {
					this.sender.sendMsgToCurrentClient(
						'Please wait for your turn, or type "help" for the commands information.'
					);
				}
			}
			
			break;
		
		// Chat
		default:
			
			let msg = input.join(" ").slice(player.length);
			if( msg === "")
				break;
			
			this.sender.sendMsgToAll(player + ":" + msg);
			
			break;
	}
  }
};

/*/ Comandos de teste
jogo = new game()
jogo.processInput("new join Fulano")
jogo.processInput("new join Ciclano")
jogo.processInput("Ciclano help")
jogo.processInput("Fulano start")
jogo.processInput("Fulano attack Ciclano")
jogo.processInput("Ciclano attack Fulano")
jogo.processInput("Fulano specialattack Ciclano")
jogo.processInput("Ciclano specialattack Fulano")
jogo.processInput("Fulano defend")
jogo.processInput("Ciclano attack Fulano")
jogo.processInput("Fulano attack Ciclano")
jogo.processInput("Ciclano attack Fulano")
jogo.processInput("Fulano attack Ciclano")

/*
	Como funciona:
		processInput faz a magica.

		Existem 3 dados pra enviar (na mesma string):
		ID, COMANDO, PARAMETRO
		processInput("id comando parametro")

		ID é o id do jogador que realizou a acao
		Se 0, esse jogador nao está no jogo ainda

		COMANDO é o comando que pode realizar ações:
		join, help, attack, specialattack, defend

		PARAMETRO é o NAME do alvo da acao
*/
