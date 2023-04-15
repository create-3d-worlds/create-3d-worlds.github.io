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

  move(delta) {
    this.checkBounds()
    this.addRandom()
    this.position.x += this.velocityY * delta
  }

  sync(delta) {
    this.player.position.x += this.velocityY * delta
  }

  update(delta) {
    this.move(delta)
    if (this.playerOnPlatform) this.sync(delta)
  }
}
