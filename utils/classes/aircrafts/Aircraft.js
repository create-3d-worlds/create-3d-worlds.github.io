import * as THREE from 'three'
import input from '/utils/classes/Input.js'
import { addSolids, distanceDown, distanceFront } from '/utils/helpers.js'

const clock = new THREE.Clock()

const angleSpeed = 2
const maxRoll = Infinity

/* Base class for Airplane and Zeppelin */
export default class Aircraft {
  constructor({
    mesh, speed = 1, maxSpeed = speed * 2, minSpeed = 0.1, minHeight = 5, minDistance = 120, maxPitch = Infinity, animations,
  } = {}) {
    this.mesh = mesh
    this.animations = animations
    this.speed = speed
    this.speedFactor = speed * .01
    this.maxSpeed = maxSpeed
    this.minSpeed = minSpeed
    this.minHeight = minHeight
    this.minDistance = minDistance
    this.maxPitch = maxPitch
    this.solids = []
    this.mixer = new THREE.AnimationMixer(mesh.type === 'Group' ? mesh.children[0] : mesh)
    this.animations = animations
    if (animations) {
      const clip = this.animations[0]
      this.action = this.mixer.clipAction(clip)
      this.action.play()
    }
  }

  /* GETTERS */

  get direction() {
    if (!this.mesh) return { x: 0, y: 0, z: 0 }
    return new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion)
  }

  get isTouchingGround() {
    const { mesh, solids } = this
    const groundDistance = distanceDown({ pos: mesh.position, solids })
    return groundDistance < this.minHeight
  }

  get isTooLow() {
    const { mesh, solids } = this
    const groundDistance = distanceDown({ pos: mesh.position, solids })
    return groundDistance < this.minHeight * 2
  }

  get isTooNear() {
    const distance = distanceFront({ mesh: this.mesh, solids: this.solids })
    return distance < this.minDistance
  }

  get isMoving() {
    return this.speed > this.minSpeed
  }

  /* UTILS */

  addSolids(...newSolids) {
    addSolids(this.solids, ...newSolids)
  }

  normalizeAngles() {
    this.mesh.rotation.x %= Math.PI * 2
    this.mesh.rotation.y %= Math.PI * 2
    this.mesh.rotation.z %= Math.PI * 2
  }

  /* CONTROLS */

  up(delta) {
    if (this.mesh.position.y < this.minHeight) return
    this.pitch(-angleSpeed * delta * .1)
  }

  down(delta) {
    this.pitch(angleSpeed * delta * .1)
  }

  left(delta) {
    if (this.speed < 0.2) this.yaw(angleSpeed * delta * 0.3) // ako je sleteo
    else this.roll(angleSpeed * delta)
  }

  right(delta) {
    if (this.speed < 0.2) this.yaw(-angleSpeed * delta * 0.3)
    else this.roll(-angleSpeed * delta)
  }

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

  moveForward(delta) {
    // https://stackoverflow.com/questions/38052621/
    this.mesh.position.add(this.direction.multiplyScalar(this.speed * delta))
  }

  accelerate() {
    if (this.speed < this.maxSpeed)
      this.speed += this.speedFactor
  }

  deaccelerate() {
    if (this.speed >= this.minSpeed)
      this.speed -= this.speedFactor
  }

  stabilize() {
    if (input.keyPressed) return
    const unrollFactor = 0.04
    const rollAngle = Math.abs(this.mesh.rotation.z)
    if (this.mesh.rotation.z > 0) this.roll(-rollAngle * unrollFactor)
    if (this.mesh.rotation.z < 0) this.roll(rollAngle * unrollFactor)
  }

  slowDown(slowFactor = 0.5) {
    this.speed *= slowFactor
  }

  /* LOOP */

  handleInput(delta) {
    if (input.left) this.left(delta)
    if (input.right) this.right(delta)

    if (input.up) this.up(delta)
    if (input.down) this.down(delta)

    if (input.pressed.PageUp || input.pressed.Space) this.accelerate(delta)
    if (input.pressed.PageDown) this.deaccelerate()
  }

  autopilot(delta) {
    if (!this.isMoving) return
    if (this.isTooNear || this.isTooLow) this.up(delta)
  }

  update(delta = 1 / 60) {
    if (!this.mesh) return
    this.normalizeAngles()
    if (!input.down) this.autopilot(delta)
    this.handleInput(delta)
    this.moveForward(delta)
    this.stabilize()

    if (!this.mixer || !this.action) return
    this.mixer.update(clock.getDelta())

    if (this.isTouchingGround) this.action.stop()
    else this.action.play()
  }
}
