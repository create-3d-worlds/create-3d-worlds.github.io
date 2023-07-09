import * as THREE from 'three'
import State from './State.js'
import { dir } from '/utils/constants.js'

export default class FlyState extends State {
  constructor(actor, name) {
    super(actor, name)
    this.maxJumpTime = Infinity
  }

  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    this.jumpTime = 0

    if (this.action) {
      this.action.reset()
      this.action.setLoop(THREE.LoopOnce, 1)
      this.action.clampWhenFinished = true
      this.transitFrom(oldAction, .5)

      if (this.actor.input.down) this.reverseAction()
    }
  }

  get ableToJump() {
    return this.actor.input.space && this.jumpTime < this.maxJumpTime
  }

  shouldAddForce(delta) {
    return this.actor.velocity.y < this.actor.maxVelocityY
  }

  update(delta) {
    const { actor } = this

    actor.updateTurn(delta)
    actor.updateMove(delta)
    actor.applyGravity(delta)

    if (this.ableToJump) {
      this.jumpTime++
      if (this.shouldAddForce(delta))
        actor.velocity.y += actor.jumpForce * delta
    }

    if (actor.velocity.y > 0 && actor.directionBlocked(dir.up))
      actor.velocity.y = -actor.velocity.y

    actor.applyVelocityY(delta)

    /* TRANSIT */

    if (this.actor.velocity.y < 0 && !this.ableToJump)
      this.actor.setState('fall')
  }
}