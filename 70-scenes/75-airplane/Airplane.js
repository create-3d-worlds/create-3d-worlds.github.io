import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import keyboard from '/classes/Keyboard.js'

const angle = 0.015
const displacement = .3
const maxPitch = Math.PI / 8

export default class Airplane {
  constructor(callback, { modelSrc = '/assets/models/s-e-5a/model.dae', scale = .2, minHeight = 15 } = {}) {
    this.minHeight = minHeight
    new ColladaLoader().load(modelSrc, collada => {
      this.mesh = this.prepareModel(collada.scene, scale)
      this.mesh.position.y = 50
      callback(this.mesh)
    })
  }

  // https://stackoverflow.com/questions/28848863/
  prepareModel(mesh, scale) {
    mesh.scale.set(scale, scale, scale)
    mesh.rotateX(-Math.PI / 20) // ispravlja avion
    // center axis of rotation
    const box = new THREE.Box3().setFromObject(mesh)
    box.center(mesh.position) // re-sets the mesh position
    mesh.position.multiplyScalar(- 1)
    const group = new THREE.Group()
    // group.traverse(child => child.castShadow = true) // eslint-disable-line no-return-assign
    mesh.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    group.add(mesh)
    return group
  }

  up() {
    // move down
    if (this.mesh.position.y < this.minHeight) return
    this.mesh.translateY(-displacement)

    // pitch down
    if (this.mesh.rotation.x > -maxPitch)
      this.mesh.rotateX(-angle / 10)
  }

  down() {
    // move up
    this.mesh.translateY(displacement)
    // pitch up
    if (this.mesh.rotation.x < maxPitch)
      this.mesh.rotateX(angle / 10)
  }

  left() {
    // roll right
    if (this.mesh.rotation.z > Math.PI / 3) return
    this.mesh.rotateZ(angle)
  }

  right() {
    // roll left
    if (this.mesh.rotation.z < -Math.PI / 3) return
    this.mesh.rotateZ(-angle)
  }

  stabilize() {
    if (keyboard.keyPressed) return
    const pitch = Math.abs(this.mesh.rotation.x)
    if (this.mesh.rotation.x > 0) this.mesh.rotation.x -= pitch * 0.25
    if (this.mesh.rotation.x < 0) this.mesh.rotation.x += pitch * 0.25
    const roll = Math.abs(this.mesh.rotation.z)
    if (this.mesh.rotation.z > 0) this.mesh.rotation.z -= roll * 0.25
    if (this.mesh.rotation.z < 0) this.mesh.rotation.z += roll * 0.25
  }

  accelerate() {}

  moveForward() {
    // https://github.com/mrdoob/three.js/issues/1606
    // https://stackoverflow.com/questions/38052621/
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion)
    this.mesh.position.add(direction)
  }

  update() {
    if (!this.mesh) return
    // this.moveForward()
    this.stabilize()

    if (keyboard.left) this.left()
    if (keyboard.right) this.right()

    if (keyboard.up) this.up()
    if (keyboard.down) this.down()
    if (keyboard.pressed.Space) this.accelerate()
  }

}
