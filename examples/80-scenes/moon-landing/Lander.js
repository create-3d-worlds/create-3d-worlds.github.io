import Sprite from './Sprite.js'
import input from '/utils/classes/Input.js'
import { Flame } from '/utils/classes/Particles.js'
import { getSize } from '/utils/helpers.js'

export default class Lander extends Sprite {
  constructor(mesh) {
    super(mesh)
    this.fuel = 2000
    this.particles = new Flame()
    this.particles.mesh.rotateX(Math.PI * .5)
    this.particles.mesh.material.opacity = 0
    this.mesh.add(this.particles.mesh)
    this.failure = false
  }

  handleInput(dt) {
    if (!this.falling) return

    if (!input.keyPressed) this.clearThrust()

    if (this.fuel < 1) return

    if (input.down) {
      this.addThrust(0, [0, -1, 0])
      this.addVector(Math.PI / 2, .09 * dt)
      this.fuel--
    }

    if (this.fuel < .5) return

    if (input.left) {
      this.addThrust(-Math.PI * .5, [-1.75, 1.5, 0])
      this.addVector(0, .1 * dt)
      this.fuel -= 0.5
    }

    if (input.right) {
      this.addThrust(Math.PI * .5, [1.75, 1.5, 0])
      this.addVector(Math.PI, .1 * dt)
      this.fuel -= 0.5
    }
  }

  addThrust(angle, pos) {
    this.particles.mesh.rotation.y = angle
    this.particles.mesh.position.set(...pos)
    this.particles.mesh.material.opacity = 1
    this.shouldFadeOut = false
  }

  clearThrust() {
    this.shouldFadeOut = true
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
    if (this.dy < -0.04) this.failure = true // must before setSpeed(0)
    this.setSpeed(0)

    if (this.failure) {
      this.mesh.rotation.z = Math.PI * .5
      this.addThrust(Math.PI * .5, [0, 1.25, 0])
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
    this.particles.update({ delta, max: 3, loop: !this.shouldFadeOut })
  }
}
