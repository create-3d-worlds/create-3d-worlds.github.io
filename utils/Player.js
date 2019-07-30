import Canvas from './Canvas.js'
import keyboard from './keyboard.js'
import {CIRCLE, UP, DOWN, LEFT, RIGHT} from './constants.js'

const {ctx} = new Canvas()

export default class Player {
  constructor(map, x, y, angle = 0) {
    this.x = x
    this.y = y
    this.angle = angle
    this.map = map
    this.speed = 0.03
  }

  checkKeys() {
    if (keyboard.pressed[LEFT]) this.turn(-this.speed)
    if (keyboard.pressed[RIGHT]) this.turn()
    if (keyboard.pressed[UP]) this.walk()
    if (keyboard.pressed[DOWN]) this.walk(-this.speed / 2)
  }

  walk(speed = this.speed) {
    const dx = Math.cos(this.angle) * speed
    const dy = Math.sin(this.angle) * speed
    if (this.map.daj(this.x + dx, this.y) <= 0) this.x += dx
    if (this.map.daj(this.x, this.y + dy) <= 0) this.y += dy
  }

  turn(speed) {
    this.angle = (this.angle + speed + CIRCLE) % (CIRCLE)
  }

  update() {
    this.checkKeys()
  }

  render() {
    const playerSize = 5
    const lampColor = '#ff0'
    const playerColor = '#f00'
    const x = Math.floor(this.x * this.map.cellSize)
    const y = Math.floor(this.y * this.map.cellSize)
    ctx.fillStyle = playerColor
    ctx.beginPath()
    ctx.arc(x, y, playerSize, this.angle, this.angle + CIRCLE)
    ctx.fill()
    ctx.fillStyle = lampColor
    ctx.beginPath()
    ctx.arc(x, y, playerSize, this.angle + CIRCLE, this.angle + CIRCLE)
    ctx.arc(x, y, playerSize * 3, this.angle - 0.15 * Math.PI, this.angle + 0.15 * Math.PI)
    ctx.fill()
  }
}
