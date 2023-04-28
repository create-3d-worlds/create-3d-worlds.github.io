import * as THREE from 'three'
import input from '/utils/io/Input.js'
import { addSolids, getMesh, getGroundY } from '/utils/helpers.js'
import ChaseCamera from '/utils/actor/ChaseCamera.js'
import GameObject from '/utils/objects/GameObject.js'

const angleSpeed = 2
const maxRoll = Infinity

/* Base class for Airplane and Zeppelin */
export default class Aircraft extends GameObject {
  constructor({
    mesh, speed = 1, maxSpeed = speed * 2.5, minSpeed = speed * .1, minHeight = 5, minDistance = 120, maxPitch = Infinity, animations, solids, camera, pos, altitude = minHeight * 3, name
  } = {}) {
    super({ mesh, pos, solids, altitude, name })
    this.speed = speed
    this.speedFactor = speed * .01
    this.maxSpeed = maxSpeed
    this.minSpeed = minSpeed
    this.minHeight = minHeight
    this.minDistance = minDistance
    this.maxPitch = maxPitch
    this.solids = []
    this.groundY = 0
    this.mixer = new THREE.AnimationMixer(getMesh(this.mesh))
    this.t = 0

    if (animations) {
      const clip = this.animations[0]
      this.action = this.mixer.clipAction(clip)
      this.action.play()
    }

    if (solids)
      this.addSolids(solids)

    if (camera) {
      this.chaseCamera = new ChaseCamera({ camera, mesh: this.mesh, height: 2, speed: this.speed * .5 })
      this.chaseCamera.distance = 6
      this.shouldAlignCamera = true
    }
  }

  /* GETTERS */

  get direction() {
    if (!this.mesh) return { x: 0, y: 0, z: 0 }
    return new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion)
  }

  get groundDistance() {
    return this.mesh.position.y - this.groundY
  }

  get isTouchingGround() {
    return this.groundDistance < this.minHeight
  }

  get isTooLow() {
    return this.groundDistance < this.minHeight * 2
  }

  get isMoving() {
    return this.speed > this.minSpeed
  }

  /* UTILS */

  addSolids(...newSolids) {
    addSolids(this.solids, ...newSolids)
  }

  updateGround() {
    const { solids } = this
    if (!solids) return

    this.groundY = getGroundY({ pos: this.mesh.position, solids })
  }

  normalizeAngles() {
    this.mesh.rotation.x %= Math.PI * 2
    this.mesh.rotation.y %= Math.PI * 2
    this.mesh.rotation.z %= Math.PI * 2
  }

  /* CONTROLS */

  up(delta) {
    if (this.mesh.position.y < this.minHeight) return
    this.pitch(-.2 * delta)
  }

  down(delta) {
    this.pitch(.2 * delta)
  }

  left(delta) {
    if (this.speed < 0.2) this.yaw(angleSpeed * 0.3 * delta) // ako je sleteo
    else this.roll(angleSpeed * delta)
  }

  right(delta) {
    if (this.speed < 0.2) this.yaw(-angleSpeed * 0.3 * delta)
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

  slowDown(slowFactor = 0.5) {
    this.speed *= slowFactor
  }

  /* UPDATES */

  handleInput(delta) {
    if (input.left) this.left(delta)
    if (input.right) this.right(delta)

    if (input.up) this.up(delta)
    if (input.down) this.down(delta)

    if (input.pressed.PageUp || input.pressed.Space) this.accelerate(delta)
    if (input.pressed.PageDown) this.deaccelerate()
  }

  autoHeight(delta) {
    if (!this.isMoving) return
    if (this.isTooLow) this.up(delta)
  }

  stabilize() {
    if (input.keyPressed) return
    const unrollFactor = 0.04
    const rollAngle = Math.abs(this.mesh.rotation.z)
    if (this.mesh.rotation.z > 0) this.roll(-rollAngle * unrollFactor)
    if (this.mesh.rotation.z < 0) this.roll(rollAngle * unrollFactor)
  }

  updateMixer(delta) {
    if (!this.mixer || !this.action) return

    this.mixer.update(delta)
    if (this.isTouchingGround) this.action.stop()
    else this.action.play()
  }

  update(delta = 1 / 60) {
    if (!this.mesh) return

    if (this.t % 3 == 0)
      this.updateGround()
    this.normalizeAngles()
    this.handleInput(delta)
    if (!input.down) this.autoHeight(delta)
    this.moveForward(delta)
    this.stabilize()

    if (this.shouldAlignCamera) {
      this.chaseCamera.alignCamera()
      this.shouldAlignCamera = false
    }
    this.chaseCamera?.update(delta)

    this.updateMixer(delta)
    this.t++
  }
}
