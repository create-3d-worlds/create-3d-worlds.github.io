import State from './State.js'

export default class AttackLoopState extends State {

  constructor(...args) {
    super(...args)
    this.onLoopEnd = this.onLoopEnd.bind(this)
  }

  enter(oldState, oldAction) {
    super.enter(oldState)
    this.actor.enterAttack()

    if (this.action) {
      this.action.reset()
      this.transitFrom(oldAction, .25)
      this.actor.mixer.addEventListener('loop', this.onLoopEnd)
    }
  }

  onLoopEnd() {
    if (this.actor.input[this.name]) this.actor.enterAttack()
    else this.actor.setState(this.prevOrIdle)
  }

  update(delta) {
    if (this.actor.turnWhileAttack)
      this.actor.updateTurn(delta)
  }

  exit() {
    this.actor?.mixer?.removeEventListener('loop', this.onLoopEnd)
    if (this.actor.exitAttack) this.actor.exitAttack()
  }
}
