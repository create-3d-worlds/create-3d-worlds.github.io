import { clock } from '/utils/scene.js'
import Player from '/classes/Player.js'
import { createAvatar, uniforms, skins } from '/utils/createAvatar.js'

export default class Avatar extends Player {
  constructor({ size = 2, speed = size * 5, skin = skins.STONE } = {}) {
    super({ speed })
    this.size = size
    this.mesh = createAvatar({ skin, size })
    this.leftHand = this.mesh.getObjectByName('leftHand')
    this.rightHand = this.mesh.getObjectByName('rightHand')
    this.leftLeg = this.mesh.getObjectByName('leftLeg')
    this.rightLeg = this.mesh.getObjectByName('rightLeg')
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
