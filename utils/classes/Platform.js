import { createBox } from '/utils/geometry.js'
import GameObject from '/utils/actor/GameObject.js'

export default class Platform extends GameObject {
  constructor({ pos, range = 29, velocityX = 2 } = {}) {
    super({ mesh: createBox({ width: 5, height: 1, depth: 2.5, file: 'metal/platform.png' }), pos })
    this.velocityX = velocityX
    this.range = range
  }

  get player() {
    return this.scene?.getObjectByName('player')
  }

  get playerOnPlatform() {
    if (!this.player) return false
    return this.withinHeight && this.withinWidth
  }

  get withinHeight() {
    return this.player.position.y <= this.position.y + this.height // -9
      && this.player.position.y > this.position.y // -10
  }

  get withinWidth() {
    return this.player.position.x > this.position.x - this.width * .45
      && this.player.position.x < this.position.x + this.width * .45
  }

  checkBounds() {
    if (this.position.x >= this.range) this.velocityX = -this.velocityX
    if (this.position.x <= -this.range) this.velocityX = this.velocityX
  }

  addRandom() {
    if (Math.random() > .997) this.velocityX = -this.velocityX
  }

  move(delta) {
    this.checkBounds()
    this.addRandom()
    this.position.x += this.velocityX * delta
  }

  sync(delta) {
    this.player.position.x += this.velocityX * delta
  }

  update(delta) {
    this.move(delta)
    if (this.playerOnPlatform) this.sync(delta)
  }
}
