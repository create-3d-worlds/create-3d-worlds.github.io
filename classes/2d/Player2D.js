import keyboard from '../Keyboard.js'

const CIRCLE = Math.PI * 2

export default class Player2D {
  constructor(map, x, y, angle = 0) {
    if (x == undefined || y == undefined) {
      const [randX, randY] = map.randomEmptyField
      this.x = randX
      this.y = randY
    } else {
      this.x = x
      this.y = y
    }
    this.angle = angle
    this.map = map
    this.speed = 0.03
  }

  get z() {
    return this.y
  }

  checkKeys() {
    if (keyboard.left) this.turn(-this.speed)
    if (keyboard.right) this.turn(this.speed)
    if (keyboard.up) this.move()
    if (keyboard.down) this.move(-this.speed / 2)
  }

  move(speed = this.speed) {
    const dx = Math.cos(this.angle) * speed
    const dy = Math.sin(this.angle) * speed
    if (this.map.getFieldValue(this.x + dx, this.y) == 0) this.x += dx
    if (this.map.getFieldValue(this.x, this.y + dy) == 0) this.y += dy
  }

  turn(amount) {
    this.angle = (this.angle + amount) % CIRCLE
  }

  update() {
    this.checkKeys()
  }
}
