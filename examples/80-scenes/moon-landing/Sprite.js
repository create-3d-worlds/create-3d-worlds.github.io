/* source: simpleGame.js by Andy Harris, 2011/2012 */

export default class Sprite {
  constructor(mesh) {
    this.mesh = mesh
    this.dx = 0
    this.dy = 0
    this.moveAngle = 0
    this.speed = 0
    this.falling = true
  }

  setPosition(x, y) {
    this.mesh.position.x = x
    this.mesh.position.y = y
  }

  calcVector() {
    // used to recalculate dx and dy based on speed and angle
    this.dx = this.speed * Math.cos(this.moveAngle)
    this.dy = this.speed * Math.sin(this.moveAngle)
  }

  calcSpeedAngle() {
    // opposite of calcVector: sets speed and moveAngle based on dx, dy
    this.speed = Math.sqrt((this.dx * this.dx) + (this.dy * this.dy))
    this.moveAngle = Math.atan2(this.dy, this.dx)
  }

  setSpeed(speed) {
    this.speed = speed
    this.calcVector()
  }

  // Modify the current motion vector by adding a new vector to it
  addVector(angle, thrust) {
    const newDX = thrust * Math.cos(angle)
    const newDY = thrust * Math.sin(angle)
    this.dx += newDX
    this.dy += newDY

    // ensure speed and angle are updated
    this.calcSpeedAngle()
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
