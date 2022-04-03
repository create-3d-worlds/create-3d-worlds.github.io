import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'

import keyboard from '/classes/Keyboard.js'
import { addSolids, raycastDown, raycastFront } from '/classes/actions/index.js'

const clock = new THREE.Clock()

const angleSpeed = 0.03
const maxRoll = Infinity
const minDistance = 120
const minSpeed = 0.1
const speedFactor = 0.03

/* Base class for Airplane and Zeppelin */
export default class Aircraft {
  constructor(callback, {
    file = 's-e-5a/model.dae', scale = .2, minHeight = 15, speed = 1, maxSpeed = 2, maxPitch = Infinity, shouldMove = true
  } = {}) {
    this.speed = shouldMove ? speed : 0
    this.maxSpeed = maxSpeed
    this.minHeight = minHeight
    this.scale = scale
    this.maxPitch = maxPitch
    this.shouldMove = shouldMove
    this.solids = []
    const ext = file.split('.').pop()
    if (ext === 'dae') this.loadColladaModel(callback, file)
    if (ext == 'glb') this.loadGlbModel(callback, file)
  }

  loadColladaModel(callback, file) {
    new ColladaLoader().load(`/assets/models/${file}`, ({ scene: model }) => {
      this.prepareModel(model)
      this.createMesh(model)
      // this.mesh.position.y = 50
      callback(this.mesh)
    })
  }

  loadGlbModel(callback, file) {
    new GLTFLoader().load(`/assets/models/${file}`, ({ scene: model, animations }) => {
      this.mixer = new THREE.AnimationMixer(model)
      this.action = this.mixer.clipAction(animations[0])
      this.prepareModel(model)
      this.createMesh(model)
      callback(this.mesh)
    })
  }

  prepareModel(model) {
    model.scale.set(this.scale, this.scale, this.scale)
    // center axis https://stackoverflow.com/questions/28848863/
    const box = new THREE.Box3().setFromObject(model)
    box.center(model.position)
    model.position.multiplyScalar(- 1)
    model.traverse(child => {
      if (child.isMesh)
        child.castShadow = child.receiveShadow = true
    })
  }

  createMesh(model) {
    const group = new THREE.Group()
    group.add(model)
    this.mesh = group
  }

  addSolids(...newSolids) {
    addSolids(this.solids, ...newSolids)
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

  moveForward() {
    if (!this.shouldMove) return
    // https://stackoverflow.com/questions/38052621/
    this.mesh.position.add(this.direction.multiplyScalar(this.speed))
  }

  accelerate() {
    if (!this.shouldMove) return
    if (this.speed < this.maxSpeed)
      this.speed += speedFactor
  }

  deaccelerate() {
    if (this.speed >= minSpeed)
      this.speed -= speedFactor
  }

  normalizeAngles() {
    this.mesh.rotation.x %= Math.PI * 2
    this.mesh.rotation.y %= Math.PI * 2
    this.mesh.rotation.z %= Math.PI * 2
  }

  get direction() {
    if (!this.mesh) return { x: 0, y: 0, z: 0 }
    return new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion)
  }

  stabilize() {
    if (keyboard.keyPressed) return

    const unpitchFactor = 0.01
    const unrollFactor = 0.04
    const pitchAngle = Math.abs(this.mesh.rotation.x)

    if (this.mesh.rotation.x > 0) this.pitch(-pitchAngle * unpitchFactor)
    if (this.mesh.rotation.x < 0) this.pitch(pitchAngle * unpitchFactor)

    const rollAngle = Math.abs(this.mesh.rotation.z)
    if (this.mesh.rotation.z > 0) this.roll(-rollAngle * unrollFactor)
    if (this.mesh.rotation.z < 0) this.roll(rollAngle * unrollFactor)
  }

  isTouchingGround() {
    const groundDistance = raycastDown(this)
    return groundDistance < this.minHeight
  }

  isTooLow() {
    const groundDistance = raycastDown(this)
    return groundDistance < this.minHeight * 2
  }

  isTooNear() {
    const distance = raycastFront(this)
    return distance < minDistance
  }

  isMoving() {
    return this.speed > minSpeed
  }

  slowDown(slowDownFactor = 0.5) {
    this.speed *= slowDownFactor
  }

  autopilot() {
    if (keyboard.down) return
    if (!this.isMoving()) return
    if (this.isTooNear() || this.isTooLow()) this.up()
  }

  handleInput() {
    if (keyboard.left) this.left()
    if (keyboard.right) this.right()

    if (keyboard.up) this.up()
    if (keyboard.down) this.down()

    if (keyboard.pressed.PageUp || keyboard.pressed.Space) this.accelerate()
    if (keyboard.pressed.PageDown) this.deaccelerate()
  }

  update() {
    if (!this.mesh) return
    this.normalizeAngles()
    this.autopilot()
    this.handleInput()
    this.moveForward()
    this.stabilize()
    if (this.mixer) this.mixer.update(clock.getDelta())
  }
}
