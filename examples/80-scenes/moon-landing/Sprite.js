/* source: simpleGame.js by Andy Harris, 2011/2012 */

export default class Sprite {
  constructor(mesh) {
    this.mesh = mesh
    this.dx = 0
    this.dy = 0
    this.speed = 0
    this.falling = true
  }

  stop() {
    this.speed = 0
    this.dx = 0
    this.dy = 0
  }

  addVector(angle, thrust) {
    const newDX = thrust * Math.cos(angle)
    const newDY = thrust * Math.sin(angle)
    this.dx += newDX
    this.dy += newDY
    this.speed = Math.sqrt((this.dx * this.dx) + (this.dy * this.dy))
  }

  applyGravity(dt) {
    if (this.falling) this.addVector(-Math.PI / 2, .01625 * dt)
  }

  update(dt) {
    this.applyGravity(dt)
    this.mesh.position.x += this.dx
    this.mesh.position.y += this.dy
  }
}
