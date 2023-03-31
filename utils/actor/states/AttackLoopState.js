import State from './State.js'

export default class AttackLoopState extends State {

  constructor(...args) {
    super(...args)
    this.attackAgain = this.attackAgain.bind(this)
  }

  enter(oldState, oldAction) {
    super.enter(oldState)
    this.actor.attackAction()

    if (this.action) {
      this.transitFrom(oldAction, .25)
      this.actor.mixer.addEventListener('loop', this.attackAgain)
    }
  }

  attackAgain() {
    if (this.actor.input.attack) this.actor.attackAction()
  }

  update(delta) {
    const { actor } = this

    actor.updateTurn(delta)

    /* TRANSIT */

    if (!actor.input.attack && !actor.input.attack2)
      actor.setState(this.prevOrIdle)
  }

  exit() {
    this.actor?.mixer?.removeEventListener('loop', this.attackAgain)
    if (this.actor.endAttack) this.actor.endAttack()
  }
}
