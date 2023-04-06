import FlyState from './FlyState.js'

export default class DoubleJumpState extends FlyState {
  constructor(actor, name) {
    super(actor, name)
    this.maxJumpTime = actor.maxJumpTime
    this.spaceReleased = false
    this.doubleJumpUsed = false
  }

  update(delta) {
    super.update(delta)

    if (!this.input.space) this.spaceReleased = true

    if (this.spaceReleased && !this.doubleJumpUsed) {
      this.jumpTime = 0
      this.doubleJumpUsed = true
    }
  }
}