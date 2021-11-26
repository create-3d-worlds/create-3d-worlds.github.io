import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import keyboard from '/classes/Keyboard.js'

const angle = 0.015
const displacement = .3

export default class Airplane {
  constructor(callback, { modelSrc = '/assets/models/s-e-5a/model.dae', scale = .2, minHeight = 15 } = {}) {
    this.minHeight = minHeight
    new ColladaLoader().load(modelSrc, collada => {
      this.mesh = this.normalizeModel(collada.scene, scale)
      this.mesh.position.y = 50
      callback(this.mesh)
    })
  }

  // https://stackoverflow.com/questions/28848863/
  normalizeModel(mesh, scale) {
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
    this.mesh.translateY(-displacement)
  }

  down() {
    this.mesh.translateY(displacement)
  }

  left() {
    if (this.mesh.rotation.z > Math.PI / 3) return
    this.mesh.rotateZ(angle)
  }

  right() {
    if (this.mesh.rotation.z < -Math.PI / 3) return
    this.mesh.rotateZ(-angle)
  }

  accelerate() {}

  moveForward() {
    // https://github.com/mrdoob/three.js/issues/1606
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion)
    // https://stackoverflow.com/questions/38052621/moving-the-camera-in-the-direction-its-facing-with-threejs
    this.mesh.position.add(direction)
  }

  update() {
    if (!this.mesh) return
    // this.moveForward()

    if (keyboard.left) this.left()
    if (keyboard.right) this.right()

    if (keyboard.up) this.up()
    if (keyboard.down) this.down()
    if (keyboard.pressed.Space) this.accelerate()
  }

}
