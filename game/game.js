var helpText = "The current commands are:\n" +
						"join <yourName>\t\tTo join the game" +
                        "attack <player>\t\tTo attack other player" +
                        "specialAttack <player>\t\tTo use special attack on other player" +
                        "defend\t\tTo defend yourself this turn" +
                        "help\t\tTo display this list of commands.";

// Classe do mago, basicamente o player
class mage {
    constructor(name, id) {
        this.name = name
        this.id = id
        this.life = 100
        this.attackDamage = 25
        this.specialDamage = 50
        this.defending = 0
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
        return !this.defending
    }

	// Realiza uma acao com base no comando (action) e alvo (param)
    takeAction(action, param) {
        
        switch(action) {
            case 'attack':
                console.log("Attacking " + param.name + "...")
                if( this.attack(param) )
                    console.log("Success! Dealt " + this.attackDamage + " damage.")
                else
                    console.log("Fail! He or she blocked the attack.")
                
                break;
            case 'specialAttack':
                console.log("Using special attack on " + param.name + "...")
                if( this.specialAttack(param) )
                    console.log("Success! Dealt " + this.specialDamage + " damage.")
                else
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
	
	// Retorna um jogador com base em seu ID
    getPlayer( id ) {
        return this.players[id - 1]
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
        this.currentPlayer = this.players[(this.turn % nplayers + nplayers) % nplayers].id
        this.turn += 1
    }

	// Processa o texto de input para realizar as acoes do jogo
    processInput(input) {
        input = input.split(' ')
        let player = input[0]
        let command = input[1]
        let param = input[2]

        // Jogador nao registrado
        if(player == 0) {
            if( command != "join" || !param ) {
                console.log("To join the game, please say \"join <yourName>\"")
                return
            }
            
            this.addPlayer( param )

            return
        }
        
        // Solicitacao de help/comandos
        if( command == "help" ) {
            console.log(helpText)
            return
        }
        
        // Verifica se o comando eh valido
        if( ["attack", "specialAttack", "defend"].indexOf(command) ) {
            console.log("This is not a valid command. Type 'help' for display the current commands.")
            return
        }

        // No turno do jogador
        if(player == this.currentPlayer) {

            // A cada novo round reseta os escudos
            if(player == 1)
                this.disableShields()
            
            let target = this.getPlayerByName(param)
            if( !target )
                console.log("Please insert a valid target.")
            
            // O jogador realiza a acao com alvo do parametro
            this.getPlayer(player).takeAction(command, target)
            this.setNextPlayer()

        }
        // Nao esta no turno do jogador
        else
            console.log("Please wait for your turn, or type \"help\" for the commands information.")
    }
}

// Comandos de teste
jogo = new game()
jogo.processInput("0 join A")
jogo.processInput("0 join B")
jogo.setNextPlayer()
jogo.processInput("1 attack B")

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