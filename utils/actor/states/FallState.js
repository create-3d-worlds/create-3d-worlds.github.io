import { jumpStyles } from '/utils/constants.js'
import State from './State.js'

const movableJumps = [jumpStyles.FLY, jumpStyles.FLY_JUMP, jumpStyles.DOUBLE_JUMP]
const flyingJumps = [jumpStyles.FLY]

export default class FallState extends State {
  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    if (this.actor.cameraFollow) {
      this.initCameraSpeed = this.actor.cameraFollow.speed
      this.actor.cameraFollow.speed = this.initCameraSpeed * 3
    }
  }

  update(delta) {
    const { actor } = this

    actor.updateTurn(delta)
    actor.applyGravity(delta)
    actor.applyVelocityY()

    if (movableJumps.includes(actor.jumpStyle) && actor.input.up)
      actor.updateMove(delta)

    /* TRANSIT */

    if (flyingJumps.includes(actor.jumpStyle) && this.input.space)
      actor.setState('jump')

    if (!actor.inAir) {
      actor.velocity.y = 0
      actor.setState('idle')
    }
  }

  exit() {
    if (this.actor.cameraFollow)
      this.actor.cameraFollow.speed = this.initCameraSpeed
  }
}