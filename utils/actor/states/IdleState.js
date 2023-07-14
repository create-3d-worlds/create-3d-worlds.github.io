import State from './State.js'

const chooseDuration = prevState => {
  if (['run', 'flee', 'pursue'].includes(prevState)) return .75
  if (['jump', 'fall', 'attack', 'attack2'].includes(prevState)) return .25
  return .5
}

export default class IdleState extends State {

  enter(oldState, oldAction) {
    super.enter(oldState)
    if (this.action) this.transitFrom(oldAction, chooseDuration(oldState?.name))
  }

  update(delta) {
    this.actor.updateTurn(delta)

    /* TRANSIT */

    if (this.actor.input.up || this.actor.input.down)
      this.actor.setState('walk')

    if (this.input.sideLeft || this.input.sideRight)
      this.actor.setState('walk') // TODO: strafe state?

    if (this.actor.inAir)
      this.actor.setState('fall')

    if (this.input.space && this.actor.ableToJump)
      this.actor.setState('jump')

    if (this.input.attack)
      this.actor.setState('attack')

    if (this.input.attack2)
      this.actor.setState('attack2')

    if (this.input.special)
      this.actor.setState('special')

    /* ONLY FOR TEST */

    if (this.input.backspace)
      this.actor.setState('pain')

    if (this.input.pressed.Delete)
      this.actor.setState('death')
  }
}
