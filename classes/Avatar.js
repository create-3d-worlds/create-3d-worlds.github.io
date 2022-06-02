import { clock } from '/utils/scene.js'
import Player from '/classes/Player.js'
import { createAvatar, uniforms, skins } from '/utils/avatar.js'

export default class Avatar extends Player {
  constructor({ skin = skins.STONE, size, ...params } = {}) {
    super({ mesh: createAvatar({ skin, r: size }), ...params })
    this.speed = this.size * 3
    this.limbs = [
      this.mesh.getObjectByName('leftHand'), this.mesh.getObjectByName('rightHand'),
      this.mesh.getObjectByName('leftLeg'), this.mesh.getObjectByName('rightLeg')
    ]
  }

  idle() {
    this.limbs.forEach(limb => {
      limb.position.z = 0
    })
  }

  jump() {
    super.jump()
    this.limbs.forEach(limb => {
      limb.position.z = this.size * .3
    })
  }

  fall() {
    super.fall()
    this.idle()
  }

  walk(dir) {
    super.walk(dir)
    this.walkAnim()
  }

  walkAnim() {
    const r = this.size * .666
    const speedFactor = this.running ? 8 : 5
    const elapsed = Math.sin(clock.getElapsedTime() * speedFactor) * r
    this.limbs.forEach((limb, i) => {
      limb.position.z = i % 2 ? elapsed : -elapsed
    })
  }

  sideWalk(dir) {
    super.sideWalk(dir)
    this.walkAnim()
  }

  update(delta = clock.getDelta()) {
    super.update(delta)
    uniforms.time.value += 0.8 * delta // for lava skin only
  }
}
