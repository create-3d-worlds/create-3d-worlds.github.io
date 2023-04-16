import FlyState from './FlyState.js'

export default class DoubleJumpState extends FlyState {
  constructor(actor, name) {
    super(actor, name)
    this.maxJumpTime = actor.maxJumpTime
    this.spaceReleased = false
    this.doubleJumpUsed = false
  }

  transit() {
    const { actor } = this
    if (this.jumpTime >= this.maxJumpTime && this.doubleJumpUsed)
      this.actor.setState('fall')

    if (actor.onGround) {
      actor.velocity.y = 0
      actor.setState('idle')
    }
  }

  update(delta) {
    if (!this.input.space) this.spaceReleased = true

    if (this.spaceReleased && !this.doubleJumpUsed) {
      this.jumpTime = 0
      this.doubleJumpUsed = true
    }

    super.update(delta)
  }
}