import SpecialState from './SpecialState.js'

export default class AttackOnceState extends SpecialState {
  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    this.actor.attackAction()
  }

  update(delta) {
    this.actor.updateMove(delta)
    this.actor.updateTurn(delta)
  }
}