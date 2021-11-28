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

  stabilize() {
    const unpitchFactor = 0.01
    const unrollFactor = 0.04
    const pitchAngle = Math.abs(this.mesh.rotation.x)

    if (this.mesh.position.y < this.minHeight && this.mesh.rotation.x < 0) {
      this.pitch(pitchAngle * unpitchFactor)
      this.speed *= 0.99
    }

    if (keyboard.keyPressed) return

    if (this.mesh.rotation.x > 0) this.pitch(-pitchAngle * unpitchFactor)
    if (this.mesh.rotation.x < 0) this.pitch(pitchAngle * unpitchFactor)

    const rollAngle = Math.abs(this.mesh.rotation.z)
    if (this.mesh.rotation.z > 0) this.roll(-rollAngle * unrollFactor)
    if (this.mesh.rotation.z < 0) this.roll(rollAngle * unrollFactor)
  }

  update() {
    super.update()
    this.stabilize()
  }

}
