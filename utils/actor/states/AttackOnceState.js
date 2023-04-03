import SpecialState from './SpecialState.js'

export default class AttackOnceState extends SpecialState {
  enter(oldState, oldAction) {
    if (this.action)
      super.enter(oldState, oldAction)
    else
      this.duration = 300

    this.actor.enterAttack()
  }

  update(delta) {
    this.actor.updateTurn(delta)

    /* TRANSIT */

    if (!this.action && Date.now() - this.last >= this.duration)
      this.actor.setState(this.prevOrIdle)
  }

  exit() {
    if (this.actor.endAttack) this.actor.endAttack()
  }
}