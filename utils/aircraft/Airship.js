import * as THREE from 'three'
import input from '/utils/io/Keyboard.js'
import { getMesh, getGroundY } from '/utils/helpers.js'
import ChaseCamera from '/utils/actor/ChaseCamera.js'
import GameObject from '/utils/objects/GameObject.js'

const yawAngle = .01
const pitchAngle = yawAngle / 5
const maxRoll = Infinity

export default class Airship extends GameObject {
  constructor({
    mesh, speed = 1, maxSpeed = speed * 2.5, minSpeed = speed * .1, minHeight = 2, minDistance = 10, maxPitch = .1, animations, solids, camera, pos, altitude = minHeight * 3, name, cameraClass
  } = {}) {
    super({ mesh, pos, solids, altitude, name })
    this.speed = speed
    this.speedFactor = speed * .01
    this.maxSpeed = maxSpeed
    this.minSpeed = minSpeed
    this.minHeight = minHeight
    this.minDistance = minDistance
    this.maxPitch = maxPitch
    this.groundY = 0
    this.t = 0
    this.propellers = []
    this.mixer = new THREE.AnimationMixer(getMesh(this.mesh))
    this.mesh.rotation.order = 'YZX' // fix controls (default is 'ZYX')

    if (animations) {
      const clip = this.animations[0]
      this.action = this.mixer.clipAction(clip)
      this.action.play()
    }

    if (camera) {
      this.chaseCamera = new ChaseCamera({ camera, cameraClass, mesh: this.mesh, height: 2, speed: this.speed * .5 })
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
    if (this.isTouchingGround) this.speed = this.maxSpeed * .5
    this.mesh.translateY(this.speed * delta)
    this.pitch(pitchAngle)
  }

  down(delta) {
    if (this.isTouchingGround) return this.slowDown()
    this.mesh.translateY(-this.speed * delta)
    this.pitch(-pitchAngle)
  }

  left() {
    this.yaw(yawAngle)
  }

  right() {
    this.yaw(-yawAngle)
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

  accelerate(delta) {
    if (this.isTouchingGround) this.up(delta)
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

    const unpitchFactor = 0.01
    const pitchAngle = Math.abs(this.mesh.rotation.x)
    if (this.mesh.rotation.x > 0) this.pitch(-pitchAngle * unpitchFactor)
    if (this.mesh.rotation.x < 0) this.pitch(pitchAngle * unpitchFactor)
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
    if (!this.isTouchingGround)
      this.propellers.forEach(propeller => propeller.rotateZ(delta * -this.speed))

    this.t++
  }
}
