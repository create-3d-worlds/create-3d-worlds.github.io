import * as THREE from '/node_modules/three108/build/three.module.js'
import { clock } from '/utils/scene.js'
import Player from '/classes/Player.js'

const DISCO = 0
const STONE = 1
const LAVA = 2

export default class Avatar extends Player {
  constructor({ size = 2, speed = size * 3, skin = STONE } = {}) {
    super({ speed })
    this.size = size
    this.mesh = this.createMesh(skin)
  }

  idle() {
    this.leftHand.position.z = this.leftLeg.position.z =
    this.rightHand.position.z = this.rightLeg.position.z = 0
  }

  jumpAnim() {
    this.leftHand.position.z = this.rightHand.position.z =
    this.leftLeg.position.z = this.rightLeg.position.z = this.size * .3
  }

  walkAnim() {
    const elapsed = Math.sin(clock.getElapsedTime() * 5) * this.size * .666
    this.leftHand.position.z = this.leftLeg.position.z = -elapsed
    this.rightHand.position.z = this.rightLeg.position.z = elapsed
  }

  update(delta) {
    super.update(delta)
    uniforms.time.value += 0.8 * delta
  }
}
