import { clock } from '/utils/scene.js'
import Player from '/classes/Player.js'
import { createAvatar, uniforms, skins } from '/utils/createAvatar.js'

export default class Avatar extends Player {
  constructor({ size = 2, speed = size * 5, skin = skins.STONE } = {}) {
    super({ speed })
    this.size = size
    this.mesh = createAvatar({ skin, size })
    this.limbs = [this.mesh.getObjectByName('leftHand'), this.mesh.getObjectByName('rightHand'), this.mesh.getObjectByName('leftLeg'), this.mesh.getObjectByName('rightLeg')]
  }

  idle() {
    this.limbs.forEach(limb => {
      limb.position.z = 0
    })
  }

  jumpAnim() {
    this.limbs.forEach(limb => {
      limb.position.z = this.size * .3 // eslint-disable-line
    })
  }

  walkAnim() {
    const r = this.size * .666
    const speedFactor = this.running ? 8 : 5
    const elapsed = Math.sin(clock.getElapsedTime() * speedFactor) * r
    this.limbs.forEach((limb, i) => {
      limb.position.z = i % 2 ? elapsed : -elapsed
    })
  }

  sideWalkAnim() {
    this.walkAnim()
  }

  update(delta = clock.getDelta()) {
    super.update(delta)
    uniforms.time.value += 0.8 * delta // lava only
  }
}
