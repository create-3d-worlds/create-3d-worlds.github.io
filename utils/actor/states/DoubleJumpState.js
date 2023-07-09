import State from './State.js'
import { dir } from '/utils/constants.js'

export default class DoubleJumpState extends State {
  constructor(actor, name) {
    super(actor, name)
    this.maxJumpTime = actor.maxJumpTime
    this.spaceReleased = false
    this.doubleJumpUsed = false
  }

  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    this.jumpTime = 0
  }

  update(delta) {
    const { actor } = this

    if (actor.velocity.y > 0 && actor.directionBlocked(dir.up))
      actor.velocity.y = -actor.velocity.y

    if (actor.input.space
      && this.jumpTime < this.maxJumpTime
      && actor.velocity.y < actor.maxVelocityY * delta
    ) {
      this.jumpTime += delta
      actor.velocity.y += actor.jumpForce * delta
    }

    actor.updateTurn(delta)
    actor.updateMove(delta)
    actor.applyVelocityY(delta)
    actor.applyGravity(delta)

    if (!this.input.space) this.spaceReleased = true

    if (this.spaceReleased && !this.doubleJumpUsed) {
      this.jumpTime = 0
      this.doubleJumpUsed = true
    }

    /* TRANSIT */

    if (this.jumpTime >= this.maxJumpTime && this.doubleJumpUsed)
      actor.setState('fall')

    if (actor.velocity.y < 0 && actor.onGround) {
      actor.velocity.y = 0
      actor.setState('idle')
    }
  }
}