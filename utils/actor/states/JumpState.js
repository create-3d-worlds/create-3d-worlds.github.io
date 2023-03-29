import SpecialState from './SpecialState.js'

export default class JumpState extends SpecialState {

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