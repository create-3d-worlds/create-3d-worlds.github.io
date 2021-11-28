import * as THREE from '/node_modules/three108/build/three.module.js'
import keyboard from '/classes/Keyboard.js'
import Aircraft from './Aircraft.js'

const angleSpeed = 0.03

export default class Zeppelin extends Aircraft {
  constructor(callback) {
    super(mesh => {
      callback(mesh)
    }, { file: 'santos-dumont-9/model.dae' })
  }

  prepareModel(model) {
    super.prepareModel(model)
    model.rotateZ(Math.PI / 2)
  }

  up() {
    if (this.mesh.position.y < this.minHeight) return
    this.pitch(-angleSpeed / 10)
  }

  down() {
    this.pitch(angleSpeed / 10)
  }

  left() {
    this.yaw(angleSpeed)
  }

  right() {
    this.yaw(-angleSpeed)
  }

  // update() {
  //   if (!this.mesh) return
  //   this.moveForward()
  //   this.normalizeAngles()
  //   this.stabilize()

  //   if (keyboard.left) this.left()
  //   if (keyboard.right) this.right()

  //   if (keyboard.up) this.up()
  //   if (keyboard.down) this.down()
  //   if (keyboard.pressed.Space) this.accelerate()
  // }

}
