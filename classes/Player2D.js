import keyboard from './Keyboard.js'
import {CIRCLE} from '../utils/constants.js'

export default class Player2D {
  constructor(map, x, y, angle = 0) {
    if (x == undefined || y == undefined) {
      const rand = map.randomEmptyField
      this.x = rand.x
      this.y = rand.y
    } else {
      this.x = x
      this.y = y
    }
    this.angle = angle
    this.map = map
    this.speed = 0.03
  }

  checkKeys() {
    if (keyboard.pressed.ArrowLeft) this.turn(-this.speed)
    if (keyboard.pressed.ArrowRight) this.turn(this.speed)
    if (keyboard.pressed.ArrowUp) this.move()
    if (keyboard.pressed.ArrowDown) this.move(-this.speed / 2)
  }

  move(speed = this.speed) {
    const dx = Math.cos(this.angle) * speed
    const dy = Math.sin(this.angle) * speed
    if (this.map.getValue(this.x + dx, this.y) == 0) this.x += dx
    if (this.map.getValue(this.x, this.y + dy) == 0) this.y += dy
  }

  turn(amount) {
    this.angle = (this.angle + amount) % CIRCLE
  }

  update() {
    this.checkKeys()
    if (this.mesh) {
      this.mesh.position.z = this.y
      this.mesh.position.x = this.x
      this.mesh.rotation.y = -this.angle
    }
  }
}
