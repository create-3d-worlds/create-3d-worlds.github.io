import AnimOnceState from './AnimOnceState.js'

export default class SpecialState extends AnimOnceState {
  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    if (this.actor.enterSpecial) this.actor.enterSpecial()
  }

  exit() {
    if (this.actor.exitSpecial) this.actor.exitSpecial()
  }
}