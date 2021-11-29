import Aircraft from './Aircraft.js'

const angleSpeed = 0.03

export default class Zeppelin extends Aircraft {
  constructor(callback) {
    super(mesh => {
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
    this.mesh.translateY(0.5)
    // this.mesh.rotation.x = .1
  }

  down() {
    this.mesh.translateY(-0.5)
    // this.mesh.rotation.x = -.1
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
