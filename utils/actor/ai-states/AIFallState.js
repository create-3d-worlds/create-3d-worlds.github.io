import State from '../states/State.js'

export default class AIFallState extends State {
  update(delta) {
    const { actor } = this

    actor.updateTurn(delta)
    actor.applyGravity(delta)
    actor.applyVelocityY()

    /* TRANSIT */

    if (!actor.inAir)
      actor.setState(this.prevOrIdle)
  }
}