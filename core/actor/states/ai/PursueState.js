import RunState from '../RunState.js'
import { reactions } from '/core/constants.js'

export default class PursueState extends RunState {

  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    this.input.run = this.input.up = true
  }

  update(delta) {
    const { actor } = this

    if (!actor.targetAbove) actor.lookAtTarget()
    actor.updateMove(delta, reactions.STEP_OFF)

    /* TRANSIT */

    if (actor.distanceToTarget < actor.attackDistance)
      actor.setState('attack')

    if (!actor.targetSpotted)
      actor.setState(actor.baseState)
  }

  exit() {
    this.input.run = this.input.up = false
  }
}
