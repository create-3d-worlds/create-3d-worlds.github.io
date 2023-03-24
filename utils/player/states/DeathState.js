import SpecialState from './SpecialState.js'

export default class DeathState extends SpecialState {

  enter(oldState, oldAction) {
    if (!this.actor.mixer) return

    const active = this.actor.mixer._actions.filter(action => action.isRunning())

    if (!this.action || active.length > 1)
      this.actor.mixer.stopAllAction()

    super.enter(oldState, oldAction)
  }

  onFinish() {
    this.cleanup()
  }
}
