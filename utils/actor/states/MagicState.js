import AnimOnceState from './AnimOnceState.js'

export default class MagicState extends AnimOnceState {
  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    if (this.actor.enterMagic) this.actor.enterMagic()
  }

  update(delta) {
    // this.actor.updateTurn(delta)
  }

  exit() {
    if (this.actor.endMagic) this.actor.endMagic()
  }
}