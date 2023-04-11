/* source: simpleGame.js by Andy Harris, 2011/2012 */
import { Vector2 } from 'three'

export default class Sprite {
  constructor(mesh) {
    this.mesh = mesh
    this.velocity = new Vector2()
    this.speed = 0
    this.falling = true
  }

  stop() {
    this.speed = 0
    this.velocity.set(0, 0)
  }

  addVector(angle, thrust) {
    this.velocity.add({ x: thrust * Math.cos(angle), y: thrust * Math.sin(angle) })
    const { x, y } = this.velocity
    this.speed = Math.sqrt((x * x) + (y * y))
  }

  applyGravity(dt) {
    this.addVector(-Math.PI / 2, .01625 * dt)
  }

  update(dt) {
    if (this.falling) this.applyGravity(dt)
    this.mesh.position.x += this.velocity.x
    this.mesh.position.y += this.velocity.y
  }
}
