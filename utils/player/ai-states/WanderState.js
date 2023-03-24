import * as THREE from 'three'
import WalkState from '../states/WalkState.js'

const { randInt } = THREE.MathUtils

export default class WanderState extends WalkState {
  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    this.input.up = true
    this.interval = randInt(3000, 5000)
  }

  update(delta) {
    const { actor } = this

    this.turnEvery(this.interval)
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
