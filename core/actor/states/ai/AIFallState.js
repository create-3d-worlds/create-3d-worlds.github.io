import State from '../State.js'

export default class AIFallState extends State {
  update(delta) {
    const { actor } = this

    actor.updateTurn(delta)
    actor.applyGravity(delta)
    actor.applyVelocityY(delta)

    /* TRANSIT */

    if (actor.onGround)
      actor.setState(this.prevOrIdle)
  }
}