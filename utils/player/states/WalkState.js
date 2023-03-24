import State from './State.js'

const chooseDuration = prevState => {
  if (prevState === 'idle') return .25
  if (prevState === 'jump') return .15
  if (prevState === 'attack') return .15
  return .5
}

export default class WalkState extends State {
  enter(oldState, oldAction) {
    super.enter(oldState)
    if (!this.actions.walk) return

    // if (this.prevState === 'run') this.syncLegs()

    this.transitFrom(oldAction, chooseDuration(oldState.name))

    if (this.actor.input.down) this.reverseAction()
  }

  update(delta) {
    const { actor } = this

    actor.updateMove(delta)
    actor.updateTurn(delta)
    actor.updateStrafe(delta)

    /* TRANSIT */

    if (actor.input.space)
      actor.setState('jump')

    if (actor.inAir)
      actor.setState('fall')

    if (actor.input.attack)
      actor.setState('attack')

    if (this.input.attack2)
      this.actor.setState('attack2')

    if (actor.input.run)
      actor.setState('run')

    if (!actor.input.up && !actor.input.down
      && !actor.input.sideLeft && !actor.input.sideRight)
      actor.setState('idle')
  }

  exit() {
    this.action?.setEffectiveTimeScale(1)
  }
}