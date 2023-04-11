import { Vector2 } from 'three'

import input from '/utils/classes/Input.js'
import { Flame } from '/utils/classes/Particles.js'
import { getSize } from '/utils/helpers.js'

export default class Lander {
  constructor(mesh) {
    this.mesh = mesh
    this.fuel = 250
    this.velocity = new Vector2()
    this.falling = true
    this.failure = false

    this.flame = new Flame()
    this.flame.mesh.rotateX(Math.PI * .5)
    this.flame.mesh.material.opacity = 0
  }

  get hasLanded() {
    return !this.falling
  }

  handleInput(dt) {
    if (!this.falling) return

    if (!input.keyPressed) this.clearThrust()

    if (this.fuel < .5) return

    if (input.left) {
      this.resetFlame(-Math.PI * .5, [-1.75, 1.5, 0])
      this.addVector(0, .1 * dt)
      this.fuel -= 0.5
    }

    if (input.right) {
      this.resetFlame(Math.PI * .5, [1.75, 1.5, 0])
      this.addVector(Math.PI, .1 * dt)
      this.fuel -= 0.5
    }

    if (this.fuel < 1) return

    if (input.down) {
      this.resetFlame(0, [0, -1, 0])
      this.addVector(Math.PI / 2, .09 * dt)
      this.fuel--
    }
  }

  resetFlame(angle, pos) {
    this.mesh.add(this.flame.mesh)
    this.flame.reset({ pos, randomize: false })
    this.flame.mesh.rotation.y = angle
    this.shouldLoop = true
  }

  clearThrust() {
    this.shouldLoop = false
  }

  isSameHeight(platform) {
    const { y: platformHeight } = getSize(platform)
    return this.mesh.position.y <= platform.position.y + platformHeight // -9
      && this.mesh.position.y > platform.position.y // -10
  }

  isSameWidth(platform) {
    const { x: platformWidth } = getSize(platform)
    return this.mesh.position.x > platform.position.x - platformWidth * .45
      && this.mesh.position.x < platform.position.x + platformWidth * .45
  }

  doFailure() {
    this.mesh.rotation.z = Math.PI * .5
    this.resetFlame(Math.PI * .5, [0, 1.25, 0])
  }

  checkLanding(platform) {
    if (!this.isSameHeight(platform) || !this.isSameWidth(platform)) return

    this.falling = false
    if (this.velocity.y < -0.04) this.failure = true // must before stop()
    this.stop()

    if (this.failure)
      this.doFailure()
    else
      this.clearThrust()
  }

  stop() {
    this.velocity.set(0, 0)
  }

  addVector(angle, thrust) {
    this.velocity.add({ x: thrust * Math.cos(angle), y: thrust * Math.sin(angle) })
  }

  applyGravity(dt) {
    this.addVector(-Math.PI / 2, .01625 * dt)
  }

  update(delta) {
    if (this.falling) this.applyGravity(delta)
    this.mesh.position.x += this.velocity.x
    this.mesh.position.y += this.velocity.y
    this.handleInput(delta)
    this.flame.update({ delta, max: 3, loop: this.shouldLoop })
  }
}
