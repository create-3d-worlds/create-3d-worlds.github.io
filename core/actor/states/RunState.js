import State from './State.js'

const chooseDuration = prevState => {
  if (prevState === 'jump') return .15
  if (prevState === 'attack') return .15
  return .75
}

export default class RunState extends State {
  enter(oldState, oldAction) {
    super.enter(oldState)
    if (!this.actions.run) return

    if (this.prevState === 'walk') this.syncLegs()

    this.transitFrom(oldAction, chooseDuration(this.prevState))

    this.timeScale = this.action.timeScale
    if (this.actor.input.down) this.reverseAction(this.action, -this.timeScale)
  }

  update(delta) {
    const { actor } = this

    actor.updateMove(delta)
    actor.updateTurn(delta)
    actor.updateStrafe(delta)

    /* TRANSIT */

    if (this.input.jump && this.actor.ableToJump)
      this.actor.setState('jump')

    if (this.actor.inAir)
      this.actor.setState('fall')

    if (actor.input.attack)
      actor.setState('attack')

    if (this.input.attack2)
      this.actor.setState('attack2')

    if (!this.actor.input.run)
      actor.setState('walk')

    if (!this.actor.input.up && !this.actor.input.down
      && !this.input.strafeLeft && !this.input.strafeRight)
      actor.setState('idle')
  }

  exit() {
    this.action?.setEffectiveTimeScale(this.timeScale)
  }
}