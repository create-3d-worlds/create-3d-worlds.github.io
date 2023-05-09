import Aircraft from './Aircraft.js'

const angleSpeed = 0.03

export default class Airplane extends Aircraft {
  constructor({ speed = 20, minSpeed = 0.5, minHeight = 15, ...params } = {}) {
    super({ speed, minSpeed, minHeight, ...params })
    this.mesh.position.y = 100
  }

  get isLanding() {
    return this.isTouchingGround && this.mesh.rotation.x < 0
  }

  up() {
    if (this.isTouchingGround) return
    this.pitch(-angleSpeed / 10)
  }

  down() {
    this.pitch(angleSpeed / 10)
  }

  left() {
    if (this.speed < 0.2) this.yaw(angleSpeed * 0.3) // ako je sleteo
    else this.roll(angleSpeed)
  }

  right() {
    if (this.speed < 0.2) this.yaw(-angleSpeed * 0.3)
    else this.roll(-angleSpeed)
  }

  checkLanding() {
    if (this.isLanding) {
      this.pitch(Math.abs(this.mesh.rotation.x) * 0.1)
      this.slowDown(0.98)
    }
  }

  update() {
    this.checkLanding()
    super.update()
  }
}