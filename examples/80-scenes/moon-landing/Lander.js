import { Vector2 } from 'three'
import { keyboard } from '/core/io/Keyboard.js'
import { Flame } from '/core/Particles.js'
import GameObject from '/core/objects/GameObject.js'
import { loadModel } from '/core/loaders.js'

const mesh = await loadModel({ file: 'space/lunar-module/model.fbx', size: 2.5 })

const message = {
  fail: 'Landing failure!',
  success: 'Nice landing!',
  outOfFuel: 'Out of fuel, platform missed!',
  lost: 'Lost in space!',
}
const lowerBound = -30

export default class Lander extends GameObject {
  constructor({ platform }) {
    super ({ mesh })
    this.name = 'player'
    this.input = keyboard
    this.platform = platform
    this.flame = new Flame()
    this.flame.mesh.rotateX(Math.PI * .5)
    this.reset()
  }

  /* GETTERS */

  get onPlatform() {
    return this.platform.playerOnPlatform
  }

  get hasLanded() {
    return this.onPlatform && !this.failure
  }

  get broken() {
    return this.onPlatform && this.failure
  }

  get outOfFuel() {
    return !this.fuel && this.position.y < this.platform.position.y
  }

  get lost() {
    return this.position.y < lowerBound
  }

  get endText() {
    if (this.hasLanded) return message.success
    if (this.broken) return message.fail
    if (this.outOfFuel) return message.outOfFuel
    if (this.lost) return message.lost
    return ''
  }

  /* METHODS */

  reset() {
    this.fuel = 300
    this.position.set(0, 5, 0)
    this.mesh.rotation.z = 0
    this.velocity = new Vector2()
    this.failure = false
    this.resetFlame()
  }

  handleInput() {
    if (this.onPlatform) return
    const { input } = this

    if (this.fuel >= .5) {
      if (input.left) {
        this.resetFlame(-Math.PI * .5, [-1.75, 1.5, 0])
        this.applyForce(0, .1)
        this.fuel -= 0.5
      }
      if (input.right) {
        this.resetFlame(Math.PI * .5, [1.75, 1.5, 0])
        this.applyForce(Math.PI, .1)
        this.fuel -= 0.5
      }
    }

    if (this.fuel >= 1 && input.down) {
      this.resetFlame(0, [0, -1, 0])
      this.applyForce(Math.PI / 2, .09)
      this.fuel--
    }
  }

  resetFlame(angle, pos) {
    this.mesh.add(this.flame.mesh)
    this.flame.reset({ pos, randomize: false })
    this.flame.mesh.rotation.y = angle
    this.shouldLoop = true
  }

  doFailure() {
    this.failure = true
    this.mesh.rotation.z = Math.PI * .5
    this.resetFlame(Math.PI * .5, [0, 1.25, 0])
  }

  checkLanding() {
    if (!this.onPlatform) return

    if (this.velocity.y < -2.4)
      this.doFailure()
    else
      this.shouldLoop = false

    this.velocity.set(0, 0)
  }

  applyForce(angle, thrust) {
    this.velocity.add({ x: thrust * Math.cos(angle), y: thrust * Math.sin(angle) })
  }

  /* UPDATES */

  applyGravity() {
    this.applyForce(-Math.PI / 2, .01625)
  }

  applyVelocity(delta) {
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta
  }

  updateFlame(delta) {
    if (!this.input.keyPressed || !this.fuel) this.shouldLoop = false
    if (this.failure) this.shouldLoop = true
    this.flame.update({ delta, max: 3, loop: this.shouldLoop })
  }

  update(delta) {
    this.handleInput()
    this.checkLanding()

    if (!this.onPlatform) this.applyGravity(delta)
    this.applyVelocity(delta)
    this.updateFlame(delta)
  }
}
