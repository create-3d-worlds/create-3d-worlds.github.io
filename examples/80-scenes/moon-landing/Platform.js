import { createBox } from '/utils/geometry.js'
import GameObject from '/utils/actor/GameObject.js'

export default class Platform extends GameObject {
  constructor() {
    super({ mesh: createBox({ width: 5, height: 1, depth: 2.5, file: 'metal/platform.png' }) })
    this.velocityY = 2
    this.range = 30
    this.position.y = -10
  }

  checkBounds() {
    if (this.position.x >= this.range) this.velocityY = -this.velocityY
    if (this.position.x <= -this.range) this.velocityY = this.velocityY
  }

  checkRandom() {
    if (Math.random() > .997) this.velocityY = -this.velocityY
  }

  move(dt) {
    this.checkBounds()
    this.checkRandom()
    this.position.x += this.velocityY * dt
  }

  sync(mesh, dt) {
    mesh.position.x += this.velocityY * dt
  }
}
