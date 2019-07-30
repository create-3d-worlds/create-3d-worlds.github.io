import canvas from './Canvas.js'
import keyboard from './Keyboard.js'
import {CIRCLE} from '../utils/constants.js'

export default class Player {
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
    if (keyboard.pressed.ArrowUp) this.walk()
    if (keyboard.pressed.ArrowDown) this.walk(-this.speed / 2)
  }

  walk(speed = this.speed) {
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
  }

  render() {
    const playerSize = 5
    const x = Math.floor(this.x * this.map.cellSize)
    const y = Math.floor(this.y * this.map.cellSize)
    canvas.drawCircle(x, y, playerSize, '#f00')
    canvas.drawLamp(x, y, playerSize, this.angle, '#ff0')
  }
}
