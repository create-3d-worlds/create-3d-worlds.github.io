import { MathUtils } from 'three'
import RunState from '../states/RunState.js'

const { randInt } = MathUtils

export default class FleeState extends RunState {
  enter(oldState, oldAction) {
    super.enter(oldState, oldAction)

    this.input.up = this.input.run = true
    this.minFleeTime = randInt(500, 1000)
  }

  update(delta) {
    const { actor } = this

    actor.mesh.lookAt(actor.target.position) // looks away
    actor.updateMove(delta) // order is important

    /* TRANSIT */

    if (Date.now() - this.last > this.minFleeTime && !actor.targetInRange)
      actor.setState('idle')
  }

  exit() {
    this.input.run = this.input.up = false
  }
}
