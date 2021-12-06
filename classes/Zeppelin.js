import Aircraft from './Aircraft.js'
import keyboard from '/classes/Keyboard.js'

const angleSpeed = .01
const pitchSpeed = angleSpeed / 5

export default class Zeppelin extends Aircraft {
  constructor(callback, params) {
    super(mesh => {
      mesh.rotation.order = 'YZX' // default is 'ZYX'
      callback(mesh)
    }, { file: 'santos-dumont-9/model.dae', maxPitch: .1, ...params })
  }

  prepareModel(model) {
    model.rotateZ(Math.PI / 2)
    model.translateX(75)
    model.translateZ(40)
    super.prepareModel(model)
  }

  up() {
    this.mesh.translateY(1)
    this.pitch(pitchSpeed)
  }

  down() {
    this.mesh.translateY(-1)
    this.pitch(-pitchSpeed)
  }

  left() {
    this.yaw(angleSpeed)
  }

  right() {
    this.yaw(-angleSpeed)
  }

  // TODO: move to parent, reuse method
  stabilize() {
    if (keyboard.keyPressed) return

    const unpitchFactor = 0.01
    const unrollFactor = 0.04
    const pitchAngle = Math.abs(this.mesh.rotation.x)

    if (this.mesh.rotation.x > 0) this.pitch(-pitchAngle * unpitchFactor)
    if (this.mesh.rotation.x < 0) this.pitch(pitchAngle * unpitchFactor)

    const rollAngle = Math.abs(this.mesh.rotation.z)
    if (this.mesh.rotation.z > 0) this.roll(-rollAngle * unrollFactor)
    if (this.mesh.rotation.z < 0) this.roll(rollAngle * unrollFactor)
  }

  update() {
    if (!this.mesh) return
    super.update()
    this.stabilize()
  }

}
