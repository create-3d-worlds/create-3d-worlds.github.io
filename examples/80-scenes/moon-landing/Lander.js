import Sprite from './Sprite.js'
import input from '/utils/classes/Input.js'
import { Flame } from '/utils/classes/Particles.js'
import { getSize } from '/utils/helpers.js'

export default class Lander extends Sprite {
  constructor(mesh) {
    super(mesh)
    this.fuel = 250
    this.flame = new Flame()
    this.flame.mesh.rotateX(Math.PI * .5)
    this.flame.mesh.material.opacity = 0
    this.failure = false
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

  checkLanding(platform, dt) {
    if (!this.isSameHeight(platform) || !this.isSameWidth(platform)) return

    this.falling = false
    if (this.dy < -0.04) this.failure = true // must before stop()
    this.stop()

    if (this.failure) {
      this.mesh.rotation.z = Math.PI * .5
      this.resetFlame(Math.PI * .5, [0, 1.25, 0])
    } else
      this.clearThrust()
  }

  showStats(element) {
    let html = 'Fuel: ' + this.fuel + '<br />'
    if (!this.falling) html += (this.failure ? 'Landing failure!' : 'Nice landing!')
    element.innerHTML = html
  }

  update(delta) {
    super.update(delta)
    this.flame.update({ delta, max: 3, loop: this.shouldLoop })
  }
}
