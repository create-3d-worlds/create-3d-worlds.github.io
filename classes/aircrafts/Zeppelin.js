import Aircraft from './Aircraft.js'

const yawAngle = .01
const pitchAngle = yawAngle / 5
const pitchSpeed = .5

export default class Zeppelin extends Aircraft {
  constructor({ mesh, maxPitch = .1, speed = .75, minHeight = 30, shouldMove = false } = {}) {
    super({ mesh, maxPitch, speed, minHeight, shouldMove })
    mesh.rotation.order = 'YZX' // default is 'ZYX'
  }

  // prepareModel(model) {
  //   model.rotateZ(Math.PI / 2)
  //   model.translateX(75)
  //   model.translateZ(40)
  //   super.prepareModel(model)
  // }

  up() {
    this.mesh.translateY(pitchSpeed)
    this.pitch(pitchAngle)
  }

  down() {
    if (this.isTouchingGround()) return this.slowDown()
    this.mesh.translateY(-pitchSpeed)
    this.pitch(-pitchAngle)
  }

  left() {
    this.yaw(yawAngle)
  }

  right() {
    this.yaw(-yawAngle)
  }
}
