import Aircraft from './Aircraft.js'

const yawAngle = .01
const pitchAngle = yawAngle / 5

export default class Zeppelin extends Aircraft {
  constructor({ maxPitch = .1, speed = .75, minHeight = 30, ...params } = {}) {
    super({ maxPitch, speed, minHeight, ...params })
    this.mesh.rotation.order = 'YZX' // fix controls (default is 'ZYX')

    this.mesh.traverse(child => {
      if (child.name === 'propeler') this.propeler = child
    })
  }

  up() {
    if (this.isTouchingGround()) this.speed = this.maxSpeed * .5
    this.mesh.translateY(this.speed * .75)
    this.pitch(pitchAngle)
  }

  down() {
    if (this.isTouchingGround()) return this.slowDown()
    this.mesh.translateY(-this.speed * .75)
    this.pitch(-pitchAngle)
  }

  left() {
    this.yaw(yawAngle)
  }

  right() {
    this.yaw(-yawAngle)
  }

  accelerate() {
    if (this.isTouchingGround()) this.up()
    super.accelerate()
  }

  stabilize() {
    super.stabilize()
    const unpitchFactor = 0.01
    const pitchAngle = Math.abs(this.mesh.rotation.x)
    if (this.mesh.rotation.x > 0) this.pitch(-pitchAngle * unpitchFactor)
    if (this.mesh.rotation.x < 0) this.pitch(pitchAngle * unpitchFactor)
  }

  update(delta) {
    super.update()
    if (!this.isTouchingGround()) this.propeler?.rotateY(delta * -1)
  }
}
