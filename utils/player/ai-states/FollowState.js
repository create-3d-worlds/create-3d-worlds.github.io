import WalkState from '../states/WalkState.js'
import { reactions } from '/utils/constants.js'

export default class FollowState extends WalkState {

  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    this.input.up = true
    this.actor.randomizeAction()
  }

  update(delta) {
    const { actor } = this

    actor.lookAtTarget()
    actor.updateMove(delta, reactions.STEP_OFF)

    /* TRANSIT */

    if (!actor.targetInRange)
      actor.setState('idle')

    if (actor.distancToTarget < actor.followDistance)
      actor.setState('idle')
  }

  exit() {
    this.input.up = false
  }
}
