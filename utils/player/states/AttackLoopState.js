import State from './State.js'

export default class AttackLoopState extends State {

  enter(oldState, oldAction) {
    super.enter(oldState)
    if (this.action) this.transitFrom(oldAction, .5)
    this.actor.attackAction()
  }

  update(delta) {
    const { actor } = this

    this.actor.updateTurn(delta)

    /* TRANSIT */

    if (!actor.input.attack && !actor.input.attack2)
      actor.setState(this.prevOrIdle)
  }

  exit() {
    if (this.actor.endAttack) this.actor.endAttack()
  }
}
