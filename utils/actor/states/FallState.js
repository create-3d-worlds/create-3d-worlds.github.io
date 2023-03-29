import { jumpStyles } from '/utils/constants.js'
import State from './State.js'

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

    if ([jumpStyles.FLY, jumpStyles.FLY_JUMP].includes(actor.jumpStyle) && actor.input.up)
      actor.updateMove(delta)

    /* TRANSIT */

    if (actor.jumpStyle === jumpStyles.FLY && this.input.space)
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