import State from './State.js'

export default class AttackLoopState extends State {

  constructor(...args) {
    super(...args)
    this.onLoopEnd = this.onLoopEnd.bind(this)
  }

  enter(oldState, oldAction) {
    super.enter(oldState)
    this.actor.attackAction()

    if (this.action) {
      this.transitFrom(oldAction, .25)
      this.actor.mixer.addEventListener('loop', this.onLoopEnd)
    }
  }

  onLoopEnd() {
    if (this.actor.input.attack) this.actor.attackAction()
    else this.actor.setState(this.prevOrIdle)
  }

  update(delta) {
    const { actor } = this

    actor.updateTurn(delta)
  }

  exit() {
    this.actor?.mixer?.removeEventListener('loop', this.onLoopEnd)
    if (this.actor.endAttack) this.actor.endAttack()
  }
}
