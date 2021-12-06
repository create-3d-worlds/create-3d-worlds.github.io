import Aircraft from './Aircraft.js'
import keyboard from '/classes/Keyboard.js'

const angleSpeed = 0.03

export default class Airplane extends Aircraft {
  constructor(callback, params = {}) {
    super(mesh => {
      mesh.rotateX(-Math.PI / 20) // spusta nos aviona
      callback(mesh)
    }, params)
  }

  up() {
    if (this.mesh.position.y < this.minHeight) return
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
    if (this.mesh.position.y < this.minHeight && this.mesh.rotation.x < 0) {
      this.pitch(Math.abs(this.mesh.rotation.x) * 0.01)
      this.speed *= 0.99
    }
  }

  stabilize() {
    this.checkLanding()
    super.stabilize()
  }
}
