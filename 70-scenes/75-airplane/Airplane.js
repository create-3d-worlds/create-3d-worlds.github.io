import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import keyboard from '/classes/Keyboard.js'

const angle = 0.015
const maxRoll = Math.PI * 0.38
const maxPitch = Math.PI * 0.2
const maxSpeed = 1

export default class Airplane {
  constructor(callback, { modelSrc = '/assets/models/s-e-5a/model.dae', scale = .2, minHeight = 15 } = {}) {
    this.speed = 1
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
    if (this.mesh.position.y < this.minHeight) return
    this.pitch(-angle / 10)
  }

  down() {
    this.pitch(angle / 10)
  }

  left() {
    if (this.speed < 0.2) this.yaw(angle * 0.3) // ako je sleteo
    else this.roll(angle)
  }

  right() {
    if (this.speed < 0.2) this.yaw(-angle * 0.3)
    else this.roll(-angle)
  }

  pitch(angle) {
    if (angle < 0 && this.mesh.rotation.x < -maxPitch) return
    if (angle > 0 && this.mesh.rotation.x > maxPitch) return

    this.mesh.rotateX(angle)
  }

  yaw(angle) {
    this.mesh.rotateY(angle)
  }

  roll(angle) {
    if (angle > 0 && this.mesh.rotation.z > maxRoll) return
    if (angle < 0 && this.mesh.rotation.z < -maxRoll) return

    this.mesh.rotateZ(angle)
  }

  stabilize() {
    const pitchAngle = Math.abs(this.mesh.rotation.x)
    if (this.mesh.position.y < this.minHeight && this.mesh.rotation.x < 0) {
      this.pitch(pitchAngle * 0.15)
      this.speed *= 0.99
    }

    if (keyboard.keyPressed) return

    if (this.mesh.rotation.x > 0) this.pitch(-pitchAngle * 0.15)
    if (this.mesh.rotation.x < 0) this.pitch(pitchAngle * 0.15)

    const rollAngle = Math.abs(this.mesh.rotation.z)
    if (this.mesh.rotation.z > 0) this.roll(-rollAngle * 0.15)
    if (this.mesh.rotation.z < 0) this.roll(rollAngle * 0.15)
  }

  accelerate() {
    if (this.speed < maxSpeed)
      this.speed += 0.1
  }

  moveForward() {
    // https://github.com/mrdoob/three.js/issues/1606
    // https://stackoverflow.com/questions/38052621/
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion)
    this.mesh.position.add(direction.multiplyScalar(this.speed))
  }

  update() {
    if (!this.mesh) return
    this.moveForward()
    this.stabilize()

    if (keyboard.left) this.left()
    if (keyboard.right) this.right()

    if (keyboard.up) this.up()
    if (keyboard.down) this.down()
    if (keyboard.pressed.Space) this.accelerate()
  }

}
