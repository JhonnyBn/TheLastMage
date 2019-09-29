export default class mage {
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

        if (target.isValid()) {
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
}