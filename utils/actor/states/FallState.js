import { jumpStyles } from '/utils/constants.js'
import State from './State.js'

const movableJumps = [jumpStyles.FLY, jumpStyles.FLY_JUMP, jumpStyles.DOUBLE_JUMP]
const flyingJumps = [jumpStyles.FLY]

export default class FallState extends State {
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

    if (actor.onGround) {
      actor.velocity.y = 0
      actor.setState('idle')
    }
  }
}