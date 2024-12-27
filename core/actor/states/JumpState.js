import AnimOnceState from './AnimOnceState.js'

export default class JumpState extends AnimOnceState {

  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)

    if (this.actor.input.down) this.reverseAction()
  }

  update(delta) {
    this.actor.updateMove(delta)
  }

  exit() {
    this.action?.setEffectiveTimeScale(1)
  }
}