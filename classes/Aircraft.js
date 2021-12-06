import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import keyboard from '/classes/Keyboard.js'

const angleSpeed = 0.03
const maxRoll = Infinity

/* Base class for Airplane and Zeppelin */
export default class Aircraft {
  constructor(callback, {
    file = 's-e-5a/model.dae', scale = .2, minHeight = 15, speed = 1, maxSpeed = 2, maxPitch = Infinity,
  } = {}) {
    this.speed = speed
    this.maxSpeed = maxSpeed
    this.minHeight = minHeight
    this.scale = scale
    this.maxPitch = maxPitch
    new ColladaLoader().load(`/assets/models/${file}`, collada => {
      this.prepareModel(collada.scene)
      this.createMesh(collada.scene)
      this.mesh.position.y = 50
      callback(this.mesh)
    })
  }

  prepareModel(model) {
    model.scale.set(this.scale, this.scale, this.scale)
    // https://stackoverflow.com/questions/28848863/
    const box = new THREE.Box3().setFromObject(model)
    box.center(model.position) // re-sets the model position
    model.position.multiplyScalar(- 1)
    // model.traverse(child => {
    //   if (child.isMesh) {
    //     child.castShadow = true
    //     child.receiveShadow = true
    //   }
    // })
  }

  createMesh(model) {
    const group = new THREE.Group()
    group.traverse(child => child.castShadow = true) // eslint-disable-line no-return-assign
    group.add(model)
    this.mesh = group
  }

  // HANDLE ARROWS

  up() {
    if (this.mesh.position.y < this.minHeight) return
    this.pitch(-angleSpeed / 10)
  }

  down() {
    this.pitch(angleSpeed / 10)
  }

  left() {
    if (this.speed < 0.2) this.yaw(angleSpeed * 0.3) // ako je sleteo
    else this.roll(angleSpeed)
  }

  right() {
    if (this.speed < 0.2) this.yaw(-angleSpeed * 0.3)
    else this.roll(-angleSpeed)
  }

  // MOVEMENTS

  pitch(angle) {
    if (angle < 0 && this.mesh.rotation.x < -this.maxPitch) return
    if (angle > 0 && this.mesh.rotation.x > this.maxPitch) return

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

  normalizeAngles() {
    this.mesh.rotation.x %= Math.PI * 2
    this.mesh.rotation.y %= Math.PI * 2
    this.mesh.rotation.z %= Math.PI * 2
  }

  accelerate() {
    if (this.speed < this.maxSpeed)
      this.speed += 0.1
  }

  moveForward() {
    // https://github.com/mrdoob/three.js/issues/1606
    // https://stackoverflow.com/questions/38052621/
    this.mesh.position.add(this.direction.multiplyScalar(this.speed))
  }

  get direction() {
    if (!this.mesh) return { x: 0, y: 0, z: 0 }
    return new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion)
  }

  update() {
    if (!this.mesh) return
    this.normalizeAngles()

    if (keyboard.left) this.left()
    if (keyboard.right) this.right()

    if (keyboard.up) this.up()
    if (keyboard.down) this.down()
    if (keyboard.pressed.Space) this.accelerate()
  }

}
