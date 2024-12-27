import { MathUtils } from 'three'
import { baseStates } from '/core/constants.js'
import IdleState from '../IdleState.js'

const { randInt } = MathUtils

export default class AIIdleState extends IdleState {
  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    this.interval = randInt(3000, 5000)
  }

  update() {
    const { actor } = this
    const { baseState, followDistance, targetInSightRange, targetInAttackRange, distanceToTarget } = actor

    actor.turnEvery(this.interval, Math.PI / 4)

    if (actor.hitAmount)
      actor.lookAtTarget()

    /* TRANSIT */

    if (actor.inAir)
      actor.setState('fall')

    if (actor.inPursueState && actor.targetSpotted)
      actor.setState('pursue')

    if (baseState == baseStates.defend && targetInAttackRange)
      actor.setState('attack')

    if (baseState == baseStates.flee && targetInSightRange)
      actor.setState('flee')

    if (baseState == baseStates.follow && targetInSightRange && distanceToTarget > followDistance * 1.25)
      actor.setState('follow')
  }
}
