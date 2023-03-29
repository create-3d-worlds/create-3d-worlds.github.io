import SpecialState from '../states/SpecialState.js'

export default class AIAttackOnceState extends SpecialState {
  constructor(...args) {
    super(...args)
    const { actions } = this.actor
    this.action = actions.attack2
      ? Math.random() > .5 ? actions.attack : actions.attack2
      : actions.attack
  }

  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    this.actor.lookAtTarget()
  }
}