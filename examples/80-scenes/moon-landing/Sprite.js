import { Vector2 } from 'three'

export default class Sprite {
  constructor(mesh) {
    this.mesh = mesh
    this.velocity = new Vector2()
    this.falling = true
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

  update(dt) {
    if (this.falling) this.applyGravity(dt)
    this.mesh.position.x += this.velocity.x
    this.mesh.position.y += this.velocity.y
  }
}
