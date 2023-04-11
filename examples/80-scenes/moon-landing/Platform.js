import { createBox } from '/utils/geometry.js'
import GameObject from '/utils/actor/GameObject.js'

export default class Platform extends GameObject {
  constructor() {
    super({ mesh: createBox({ width: 5, height: 1, depth: 2.5 }) })
    this.velocity = 2
    this.range = 30
    this.position.y = -10
  }

  checkBounds() {
    if (this.position.x >= this.range) this.velocity = -this.velocity
    if (this.position.x <= -this.range) this.velocity = this.velocity
  }

  checkRandom() {
    if (Math.random() > .997) this.velocity = -this.velocity
  }

  move(dt) {
    this.checkBounds()
    this.checkRandom()
    this.position.x += this.velocity * dt
  }

  sync(mesh, dt) {
    mesh.position.x += this.velocity * dt
  }
}
