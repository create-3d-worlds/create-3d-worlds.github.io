import Player from './Player.js'
import { clock } from '/utils/scene.js'
import { createAvatar, updateAvatar, uniforms, skins } from '/utils/geometry/avatar.js'
import { jumpStyles } from '/utils/constants.js'

export default class Avatar extends Player {
  constructor({ skin = skins.STONE, jumpStyle = jumpStyles.FLY, maxJumpTime = 40, size = 1, speed = size * 4, ...params } = {}) {
    super({
      mesh: createAvatar({ skin, r: size }),
      speed,
      jumpStyle,
      maxJumpTime,
      ...params,
    })
    this.skin = skin
    this.limbs = [
      this.mesh.getObjectByName('leftHand'), this.mesh.getObjectByName('rightHand'),
      this.mesh.getObjectByName('leftLeg'), this.mesh.getObjectByName('rightLeg')
    ]
    this.jumpForce = this.gravity * 1.8
    if (this.cameraFollow) {
      this.cameraFollow.speed = 4
      this.cameraFollow.distance = 4
    }
  }

  idleAnim() {
    const idleRange = .09
    this.limbs.forEach(({ position }) => {
      position.z = position.z > idleRange
        ? position.z * .9 // normalize
        : Math.sin(clock.getElapsedTime()) * idleRange // breathe
    })
  }

  walkAnim(name) {
    const r = this.height * .5
    const speedFactor = name === 'run' ? 9 : 6
    const elapsed = Math.sin(clock.getElapsedTime() * speedFactor) * r
    updateAvatar(this.mesh, elapsed)
  }

  jumpAnim() {
    this.limbs.forEach(limb => {
      limb.position.z = this.height * .3
    })
  }

  update(delta = 1 / 60) {
    super.update(delta)
    const { name } = this.currentState

    if (name === 'walk' || name === 'run')
      this.walkAnim(name)
    else if (this.input.space)
      this.jumpAnim()
    else
      this.idleAnim(true)

    if (this.skin == skins.LAVA) uniforms.time.value += 0.8 * delta
  }
}
