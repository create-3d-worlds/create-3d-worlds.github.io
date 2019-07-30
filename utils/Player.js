import Canvas from './Canvas.js'
import keyboard from './keyboard.js'
import {CIRCLE, UP, DOWN, LEFT, RIGHT} from './constants.js'

const speed = 0.3
const {ctx} = new Canvas()

export default class Player {
  constructor(map, x, y, angle = 0) {
    this.x = x
    this.y = y
    this.angle = angle
    this.map = map
  }

  update() {
    this.checkKeys()
  }

  checkKeys() {
    if (keyboard.pressed[LEFT]) this.turn(-speed / 2)
    if (keyboard.pressed[RIGHT]) this.turn(speed / 2)
    if (keyboard.pressed[UP]) this.walk(speed)
    if (keyboard.pressed[DOWN]) this.walk(-speed)
  }

  walk(step) {
    const dx = Math.cos(this.angle) * step
    const dy = Math.sin(this.angle) * step
    if (this.map.daj(this.x + dx, this.y) <= 0) this.x += dx
    if (this.map.daj(this.x, this.y + dy) <= 0) this.y += dy
  }

  turn(turnSpeed) {
    this.angle = (this.angle + turnSpeed + CIRCLE) % (CIRCLE)
  }

  crtaKruzic() {
    const playerSize = 5
    const lampColor = '#ff0'
    const playerColor = '#f00'
    const x = Math.floor(this.x * this.map.cellSize)
    const y = Math.floor(this.y * this.map.cellSize)
    // crta kruzic
    ctx.fillStyle = playerColor
    ctx.beginPath()
    ctx.arc(x, y, playerSize, this.angle, this.angle + CIRCLE)
    ctx.fill()
    // crta svetlo
    ctx.fillStyle = lampColor
    ctx.beginPath()
    ctx.arc(x, y, playerSize, this.angle + CIRCLE, this.angle + CIRCLE)
    ctx.arc(x, y, playerSize * 3, this.angle - 0.15 * Math.PI, this.angle + 0.15 * Math.PI)
    ctx.fill()
  }

  render() {
    this.map.render()
    this.crtaKruzic()
  }
}
