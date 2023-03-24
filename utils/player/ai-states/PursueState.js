import RunState from '../states/RunState.js'
import { reactions } from '/utils/constants.js'

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

    if (actor.distancToTarget < actor.attackDistance)
      actor.setState('attack')

    if (!actor.targetSpotted)
      actor.setState(actor.baseState)
  }

  exit() {
    this.input.run = this.input.up = false
  }
}
