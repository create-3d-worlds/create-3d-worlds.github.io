import WalkState from '../states/WalkState.js'

export default class PatrolState extends WalkState {
  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)
    this.input.up = true
    this.distance = 0
  }

  update(delta) {
    const { actor } = this

    this.distance += Math.abs(actor.velocity.z)

    if (this.distance >= actor.patrolDistance) {
      actor.turnSmooth()
      this.distance = 0
    }

    if (actor.mesh.userData.hitAmount)
      actor.lookAtTarget()

    actor.updateMove(delta)

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
