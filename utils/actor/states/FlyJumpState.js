import FlyState from './FlyState.js'

export default class FlyJumpState extends FlyState {
  constructor(actor, name) {
    super(actor, name)
    this.maxJumpTime = actor.maxJumpTime
  }
}