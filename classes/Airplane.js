import * as THREE from '/node_modules/three108/build/three.module.js'
import keyboard from '/classes/Keyboard.js'

const {pressed} = keyboard

const direction = new THREE.Vector3
const speed = 1.0
const angle = Math.PI / 180

export default class Kamenko {

  constructor(position) {
    this.position = position
    this.mesh = this.createMesh()
  }

  createMesh() {
    const group = new THREE.Group()
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(20, 20, 40),
      new THREE.MeshNormalMaterial()
    )
    group.add(cube)
    return group
  }

  up() {
    // this.mesh.translateZ(-step)
  }

  down() {
    // this.mesh.translateZ(step)
  }

  left() {
    this.mesh.rotateY(angle)
  }

  right() {
    this.mesh.rotateY(-angle)
  }

  accelerate() {

  }

  moveForward() {
    this.mesh.getWorldDirection(direction)
    this.mesh.position.addScaledVector(direction, speed)
    console.log(this.mesh.getWorldDirection(direction))
  }

  update() {
    if (!this.mesh) return
    this.moveForward()

    if (keyboard.left) this.left()
    if (keyboard.right) this.right()

    if (keyboard.up) this.up()
    if (keyboard.down) this.down()
    if (pressed.Space) this.accelerate()
  }

}
