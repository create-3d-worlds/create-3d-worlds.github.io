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
    }

    if (this.actor.input.down) this.reverseAction()

    if (this.actor.cameraFollow) {
      this.initCameraSpeed = this.actor.cameraFollow.speed
      this.actor.cameraFollow.speed = this.initCameraSpeed * 3
    }
  }

  update(delta) {
    const { actor } = this

    actor.updateTurn(delta)
    actor.updateMove(delta)
    actor.applyGravity(delta)

    if (actor.input.space && this.jumpTime < this.maxJumpTime) {
      if (actor.velocity.y < actor.maxVelocityY * delta)
        actor.velocity.y += actor.jumpForce * delta
      this.jumpTime++
    }

    if (actor.velocity.y > 0 && actor.directionBlocked(dir.up))
      actor.velocity.y = -actor.velocity.y

    actor.applyVelocityY()

    /* TRANSIT */

    if (actor.velocity.y <= 0 && !actor.inAir) {
      actor.velocity.y = 0
      actor.setState(this.prevState) // bez prevState brlja aktivne animacije
    }
  }

  exit() {
    this.action?.setEffectiveTimeScale(1)
    if (this.actor.cameraFollow)
      this.actor.cameraFollow.speed = this.initCameraSpeed
  }
}