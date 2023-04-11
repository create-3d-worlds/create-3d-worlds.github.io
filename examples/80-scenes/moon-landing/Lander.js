import { Vector2 } from 'three'
import input from '/utils/classes/Input.js'
import { Flame } from '/utils/classes/Particles.js'

export default class Lander {
  constructor(mesh) {
    this.mesh = mesh
    this.fuel = 250
    this.velocity = new Vector2()
    this.hasLanded = false
    this.failure = false

    this.flame = new Flame()
    this.flame.mesh.rotateX(Math.PI * .5)
    this.flame.mesh.material.opacity = 0
  }

  handleInput() {
    if (this.hasLanded) return

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

  clearThrust() {
    this.shouldLoop = false
  }

  withinHeight(platform) {
    return this.mesh.position.y <= platform.position.y + platform.height // -9
      && this.mesh.position.y > platform.position.y // -10
  }

  withinWidth(platform) {
    return this.mesh.position.x > platform.position.x - platform.width * .45
      && this.mesh.position.x < platform.position.x + platform.width * .45
  }

  doFailure() {
    this.mesh.rotation.z = Math.PI * .5
    this.resetFlame(Math.PI * .5, [0, 1.25, 0])
  }

  checkLanding(platform) {
    if (!this.withinHeight(platform) || !this.withinWidth(platform)) return

    this.hasLanded = true
    if (this.velocity.y < -2.4) this.failure = true // must before stop()
    this.stop()

    if (this.failure)
      this.doFailure()
    else
      this.clearThrust()
  }

  stop() {
    this.velocity.set(0, 0)
  }

  applyForce(angle, thrust) {
    this.velocity.add({ x: thrust * Math.cos(angle), y: thrust * Math.sin(angle) })
  }

  applyGravity() {
    this.applyForce(-Math.PI / 2, .01625)
  }

  updateFlame(delta) {
    if (!input.keyPressed) this.clearThrust()
    this.flame.update({ delta, max: 3, loop: this.shouldLoop })
  }

  update(delta) {
    this.handleInput()
    if (!this.hasLanded) this.applyGravity(delta)
    this.mesh.position.x += this.velocity.x * delta
    this.mesh.position.y += this.velocity.y * delta
    this.updateFlame(delta)
  }
}
