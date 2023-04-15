import { createBox } from '/utils/geometry.js'
import GameObject from '/utils/actor/GameObject.js'

export default class Platform extends GameObject {
  constructor({ pos } = {}) {
    super({ mesh: createBox({ width: 5, height: 1, depth: 2.5, file: 'metal/platform.png' }), pos })
    this.velocityY = 2
    this.range = 29
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
    if (this.position.x >= this.range) this.velocityY = -this.velocityY
    if (this.position.x <= -this.range) this.velocityY = this.velocityY
  }

  addRandom() {
    if (Math.random() > .997) this.velocityY = -this.velocityY
  }

  move(dt) {
    this.checkBounds()
    this.addRandom()
    this.position.x += this.velocityY * dt
  }

  sync(dt) {
    this.player.position.x += this.velocityY * dt
  }

  update(dt) {
    this.move(dt)
    if (this.playerOnPlatform) this.sync(dt)
  }
}
