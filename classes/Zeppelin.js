import Aircraft from './Aircraft.js'
import keyboard from '/classes/Keyboard.js'

const angleSpeed = 0.01

export default class Zeppelin extends Aircraft {
  constructor(callback, params) {
    super(mesh => {
      mesh.rotation.order = 'YZX' // default is 'ZYX'
      callback(mesh)
    }, { ...params, file: 'santos-dumont-9/model.dae' })
  }

  prepareModel(model) {
    model.rotateZ(Math.PI / 2)
    model.translateX(75)
    model.translateZ(40)
    super.prepareModel(model)
  }

  up() {
    this.mesh.translateY(1)
    if (this.mesh.rotation.x < .1)
      this.mesh.rotateX(.005)
  }

  down() {
    this.mesh.translateY(-1)
    if (this.mesh.rotation.x > -.1)
      this.mesh.rotateX(-.005)
  }

  left() {
    this.yaw(angleSpeed)
  }

  right() {
    this.yaw(-angleSpeed)
  }

  stabilize() {
    if (keyboard.keyPressed) return

    if (this.mesh.rotation.x > 0)
      this.mesh.rotateX(-.005)
    if (this.mesh.rotation.x < 0)
      this.mesh.rotateX(.005)

    if (this.mesh.rotation.z > 0)
      this.mesh.rotateZ(-.005)
    if (this.mesh.rotation.z < 0)
      this.mesh.rotateZ(.005)
  }

  update() {
    if (!this.mesh) return
    super.update()
    this.stabilize()
  }

}
