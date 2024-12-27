import WalkState from '../WalkState.js'
import { reactions } from '/core/constants.js'

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

    if (!actor.targetInSightRange)
      actor.setState('idle')

    if (actor.distanceToTarget < actor.followDistance)
      actor.setState('idle')
  }

  exit() {
    this.input.up = false
  }
}
