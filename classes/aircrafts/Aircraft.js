import * as THREE from '/node_modules/three127/build/three.module.js'
import keyboard from '/classes/Keyboard.js'
import { addSolids, raycastDown, raycastFront } from '/classes/actions/index.js'

const clock = new THREE.Clock()

const angleSpeed = 0.03
const maxRoll = Infinity
const minDistance = 120

/* Base class for Airplane and Zeppelin */
export default class Aircraft {
  constructor({
    mesh, animations, minHeight = 5, speed = 1, maxSpeed = 2, minSpeed = 0.1, maxPitch = Infinity,
  } = {}) {
    this.mesh = mesh
    this.animations = animations
    this.speed = speed
    this.speedFactor = speed * .01
    this.maxSpeed = maxSpeed
    this.minSpeed = minSpeed
    this.minHeight = minHeight
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

  addSolids(...newSolids) {
    addSolids(this.solids, ...newSolids)
  }

  handleInput() {
    if (keyboard.left) this.left()
    if (keyboard.right) this.right()

    if (keyboard.up) this.up()
    if (keyboard.down) this.down()

    if (keyboard.pressed.PageUp || keyboard.pressed.Space) this.accelerate()
    if (keyboard.pressed.PageDown) this.deaccelerate()
  }

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
    // https://stackoverflow.com/questions/38052621/
    this.mesh.position.add(this.direction.multiplyScalar(this.speed))
  }

  accelerate() {
    if (this.speed < this.maxSpeed)
      this.speed += this.speedFactor
  }

  deaccelerate() {
    if (this.speed >= this.minSpeed)
      this.speed -= this.speedFactor
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
    const unrollFactor = 0.04
    const rollAngle = Math.abs(this.mesh.rotation.z)
    if (this.mesh.rotation.z > 0) this.roll(-rollAngle * unrollFactor)
    if (this.mesh.rotation.z < 0) this.roll(rollAngle * unrollFactor)
  }

  isTouchingGround() {
    const { mesh, solids } = this
    const groundDistance = raycastDown({ mesh, solids })
    return groundDistance < this.minHeight
  }

  isTooLow() {
    const { mesh, solids } = this
    const groundDistance = raycastDown({ mesh, solids })
    return groundDistance < this.minHeight * 2
  }

  isTooNear() {
    const distance = raycastFront({ mesh: this.mesh, solids: this.solids })
    return distance < minDistance
  }

  isMoving() {
    return this.speed > this.minSpeed
  }

  slowDown(slowFactor = 0.5) {
    this.speed *= slowFactor
  }

  autopilot() {
    if (keyboard.down) return
    if (!this.isMoving()) return
    if (this.isTooNear() || this.isTooLow()) this.up()
  }

  update() {
    if (!this.mesh) return
    this.normalizeAngles()
    this.autopilot()
    this.handleInput()
    this.moveForward()
    this.stabilize()

    if (!this.mixer || !this.action) return
    this.mixer.update(clock.getDelta())

    if (this.isTouchingGround()) this.action.stop()
    else this.action.play()
  }
}
