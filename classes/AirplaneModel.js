import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import keyboard from '/classes/Keyboard.js'

const {pressed} = keyboard

const angle = Math.PI / 180

export default class Airplane {

  constructor({x = 0, y = 30, z = 0, modelSrc = '/assets/models/s-e-5a/model.dae', size = 35} = {}, callback) {
    this.mesh = this.createMesh()
    this.mesh.position.set(x, y, z)
    this.loadModel(callback, modelSrc, size)
  }

  loadModel(callback, modelSrc, size) {
    new ColladaLoader().load(modelSrc, collada => {
      this.mesh = this.prepareMesh(collada.scene, size, Math.PI / 2)
      callback(this.mesh)
    })
  }

  prepareMesh(mesh, size, rotate) {
    const group = new THREE.Group()
    // this.scaleMesh(mesh, size)
    // this.translateY(mesh)
    mesh.rotateY(rotate)
    // mesh.traverse(child => {
    //   if (child.isMesh) {
    //     child.castShadow = true
    //     child.receiveShadow = true
    //   }
    // })
    group.add(mesh)
    return group
  }

  scaleMesh(mesh, size) {
    const box = new THREE.Box3().setFromObject(mesh)
    const height = box.max.y - box.min.y
    const scale = size / height
    mesh.scale.set(scale, scale, scale)
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
    this.mesh.translateY(.3)
  }

  down() {
    this.mesh.translateY(-.3)
  }

  left() {
    this.mesh.rotateY(angle)
  }

  right() {
    this.mesh.rotateY(-angle)
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
    this.moveForward()

    if (keyboard.left) this.left()
    if (keyboard.right) this.right()

    if (keyboard.up) this.up()
    if (keyboard.down) this.down()
    if (pressed.Space) this.accelerate()
  }

  get position() {
    return this.mesh.position
  }

  set position(pos) {
    this.mesh.position.set(...pos)
  }

}
