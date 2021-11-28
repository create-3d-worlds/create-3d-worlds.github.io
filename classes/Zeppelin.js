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
    model.scale.set(this.scale, this.scale, this.scale)
    model.rotateZ(Math.PI / 2)
    // center axis of rotation
    const box = new THREE.Box3().setFromObject(model)
    box.center(model.position) // re-sets the model position
    model.position.multiplyScalar(- 1)
    const group = new THREE.Group()
    // group.traverse(child => child.castShadow = true) // eslint-disable-line no-return-assign
    model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    group.add(model)
    return group
  }

  up() {
    if (this.mesh.position.y < this.minHeight) return
    this.pitch(-angleSpeed / 10)
  }

  down() {
    this.pitch(angleSpeed / 10)
  }

  left() {
    this.roll(angleSpeed)
  }

  right() {
    this.roll(-angleSpeed)
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
