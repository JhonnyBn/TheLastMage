var helpText = "The current commands are:\n" +
						"join <yourName>\t\t\tTo join the game\n" +
						"start\t\t\t\t\tTo start the game\n" +
						"attack <player>\t\t\tTo attack other player\n" +
						"specialAttack <player>\tTo use special attack on other player\n" +
						"defend\t\t\t\t\tTo defend yourself this turn\n" +
						"help\t\t\t\t\tTo display this list of commands.\n";

// Classe do mago, basicamente o player
class mage {
	constructor(name, id) {
		this.name = name
		this.id = id
		this.life = 100
		this.alive = 1
		this.attackDamage = 25
		this.specialDamage = 50
		this.defending = 0
	}

	checkLife() {
		if(this.life === 0) {
			console.log(this.name + " just died.\n")
			this.alive = 0
		} else {
			console.log(this.name + " has now " + this.life + " life.\n")
		}
	}
	
	// Ataca um jogador,
	// retorna 1 se obteve sucesso, 0 caso contrário
	attack(target) {
		if( target.isValid() ) {
			target.life -= this.attackDamage
			return 1
		}
		return 0
	}
	
	// Ataca um jogador com o especial,
	// retorna 1 se obteve sucesso, 0 caso contrário
	specialAttack(target) {
		if( target.isValid() ) {
			target.life -= this.specialDamage
			return 1
		}
		return 0
	}
	
	// Defende para nao ser atacado por um turno
	defend() {
		this.defending = 1
	}
	
	// A cada turno a defesa deve ser resetada
	disableShield() {
		this.defending = 0
	}
	
	// Verifica se o jogador eh um alvo valido
	// Ele eh valido se nao estiver defendendo
	isValid() {
		return !this.defending && this.alive
	}

	// Realiza uma acao com base no comando (action) e alvo (target)
	takeAction(action, target) {
		
		switch(action) {
			case 'attack':
				console.log("Attacking " + target.name + "...")
				if( this.attack(target) ) {
					console.log("Success! Dealt " + this.attackDamage + " damage.")
					target.checkLife()
				} else
					console.log("Fail! He or she blocked the attack.")
				
				break;
			case 'specialAttack':
				console.log("Using special attack on " + target.name + "...")
				if( this.specialAttack(target) ) {
					console.log("Success! Dealt " + this.specialDamage + " damage.")
					target.checkLife()
				} else
					console.log("Fail! He or she blocked the special attack.")
				break;
			case 'defend':
				console.log("Defending until next turn.")
				this.defend()
				break;
			default:
				console.log("This is not a valid command. Type 'help' for display the current commands.")
				break;
		}
	}
}

// classe do jogo, basicamente o controlador dos players
class game {
	constructor() {
		this.players = []
		this.turn = 0
		this.currentPlayer = 0
		this.running = 0
	}
	
	// Inicia o jogo
	run() {
		this.running = 1
		this.setNextPlayer();
	}

	// Adiciona um novo jogador
	addPlayer( name ) {
		// Se o nome ja existe, nao adiciona
		if( this.getPlayerByName( name ) ) {
			console.log("Name already in use. Please choose another.")
			return
		}

		let playerId = this.players.length + 1
		this.players.push( new mage(name, playerId) )
	}
	
	// Retorna um jogador com base em seu NAME
	getPlayerByName( name ) {
		for(var mago of this.players) {
			if (mago.name == name)
				return mago
		}
	}
	
	// Reseta os escudos dos jogadores
	disableShields() {
		for( var player of this.players ) {
			player.disableShield()
		}
	}

	// Prepara a proxima rodada
	setNextPlayer() {
		let nplayers = this.players.length
		this.currentPlayer = this.players[(this.turn % nplayers + nplayers) % nplayers]
		this.turn += 1
		this.currentPlayer.disableShield()

		if( !this.currentPlayer.alive )
			this.setNextPlayer()
	}

	// Processa o texto de input para realizar as acoes do jogo
	processInput(input) {
		input = input.split(' ')
		let player = input[0]
		let command = input[1]
		let param = input[2]

		// Jogador nao registrado
		if(player == "new") {
			if( command != "join" || !param ) {
				console.log("To join the game, please say \"join <yourName>\"")
				return
			}
			
			this.addPlayer( param )
			console.log("Welcome to the game, " + param + "!\n")

			return
		}
		
		// Solicitacao de help/comandos
		if( command == "help" ) {
			console.log(helpText)
			return
		}
		
		// Comecar o jogo
		if( command == "start" ) {
			
			if( !this.running )
				this.run()
			
			return
		}

		// No turno do jogador
		if(player == this.currentPlayer.name) {

			// Verifica se o comando eh valido
			if( ["attack", "specialAttack", "defend"].indexOf(command) === -1 ) {
				console.log("This is not a valid command. Type 'help' for display the current commands.")
				return
			}

			let target = null
			if( command !== "defend" ) {
				target = this.getPlayerByName(param)
				if( target == null || !target.alive ) {
					console.log("Please insert a valid target.")
					return
				}
			}
			
			// O jogador realiza a acao com alvo do parametro
			this.getPlayerByName(player).takeAction(command, target)
			this.setNextPlayer()

		}
		// Nao esta no turno do jogador
		else {
			// Se o jogador estiver morto
			if( !this.getPlayerByName(player).alive ) {
				console.log("You are dead. Please start a new game.")
			} else {
				console.log("Please wait for your turn, or type \"help\" for the commands information.")	
			}
		}
	}
}

// Comandos de teste
jogo = new game()
jogo.processInput("new join Fulano")
jogo.processInput("new join Ciclano")
jogo.processInput("Ciclano help")
jogo.processInput("Fulano start")
jogo.processInput("Fulano attack Ciclano")
jogo.processInput("Ciclano attack Fulano")
jogo.processInput("Fulano specialAttack Ciclano")
jogo.processInput("Ciclano specialAttack Fulano")
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
		join, help, attack, specialAttack, defend
		
		PARAMETRO é o NAME do alvo da acao
*/