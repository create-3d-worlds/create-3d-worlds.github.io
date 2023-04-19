import * as THREE from 'three'
import WalkState from '../WalkState.js'

const { randInt } = THREE.MathUtils

export default class WanderState extends WalkState {
  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    this.input.up = true
    const { height } = this.actor
    this.interval = randInt(height * 1500, height * 2500)
  }

  update(delta) {
    const { actor } = this

    actor.turnEvery(this.interval)
    actor.updateMove(delta)

    if (actor.mesh.userData.hitAmount)
      actor.lookAtTarget()

    /* TRANSIT */

    if (actor.inAir)
      actor.setState('fall')

    if (actor.targetSpotted)
      actor.setState('pursue')
  }

  exit() {
    this.input.up = false
  }
}
