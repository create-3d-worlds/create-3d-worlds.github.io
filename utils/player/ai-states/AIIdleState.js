import { MathUtils } from 'three'
import IdleState from '../states/IdleState.js'

const { randInt } = MathUtils

export default class AIIdleState extends IdleState {
  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    this.interval = randInt(3000, 5000)
  }

  update() {
    const { actor } = this
    const { baseState, followDistance } = actor

    this.turnEvery(this.interval, Math.PI / 4)

    if (actor.mesh.userData.hitAmount)
      actor.lookAtTarget()

    /* TRANSIT */

    if (actor.inAir)
      actor.setState('fall')

    if (actor.inPursueState && actor.targetSpotted)
      actor.setState('pursue')

    if (baseState == 'flee' && actor.targetInRange)
      actor.setState('flee')

    if (baseState == 'follow' && actor.targetInRange && actor.distancToTarget > followDistance * 1.25)
      actor.setState('follow')
  }
}
