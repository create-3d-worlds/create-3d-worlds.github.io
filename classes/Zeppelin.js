import * as THREE from '/node_modules/three108/build/three.module.js'
import Aircraft from './Aircraft.js'
import keyboard from '/classes/Keyboard.js'

const angleSpeed = 0.03

export default class Zeppelin extends Aircraft {
  constructor(callback) {
    super(mesh => {
      mesh.rotation.order = 'YZX' // default is 'ZYX'
      callback(mesh)
    }, { file: 'santos-dumont-9/model.dae' })
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

  // https://www.youtube.com/watch?v=lcE3s5noEE4
  // https://www.youtube.com/watch?v=Ocoibc7MoKg
  stabilize() {
    // TODO: podizati ako je preblizu zemlje?
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
