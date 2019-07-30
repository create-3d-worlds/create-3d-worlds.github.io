import Canvas from './Canvas.js'
import {CIRCLE} from './constants.js'

const {ctx} = new Canvas()
const colors = ['#fff', '#444', '#701206', '#000']

export default class Tilemap {
  constructor(model, cellSize = 30) {
    this.model = model
    if (!model) this.createRandom()
    this.cellSize = cellSize
    this.height = model.length * cellSize
    this.width = this.model[0].length * cellSize
  }

  createRandom(size = 10) {
    const wallPercent = 0.3
    this.model = []
    for (let y = 0; y < size; y++) {
      this.model[y] = []
      for (let x = 0; x < size; x++)
        this.model[y][x] = Math.random() < wallPercent ? 1 : 0
    }
  }

  fieldValue(x, y) {
    x = Math.floor(x) // eslint-disable-line
    y = Math.floor(y) // eslint-disable-line
    if (x < 0 || x >= this.model[0].length || y < 0 || y >= this.model.length)
      return -1
    return this.model[y][x]
  }

  nadjiPolje(x, y) {
    const poljeX = Math.floor(x / this.cellSize)
    const poljeY = Math.floor(y / this.cellSize)
    return { y: poljeY, x: poljeX }
  }

  get randomField() {
    const y = Math.floor(Math.random() * this.model.length)
    const x = Math.floor(Math.random() * this.model[0].length)
    return {x, y}
  }

  get randomEmptyField() {
    const {x, y} = this.randomField
    if (this.fieldValue(x, y) === 0) return {x, y}
    return this.randomEmptyField
  }

  render() {
    for (let y = 0; y < this.model.length; y++)
      for (let x = 0; x < this.model[y].length; x++) {
        const eNum = this.model[y][x]
        ctx.fillStyle = colors[eNum]
        ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
      }
  }

  // maybe move to Player
  drawPlayer(playerX, playerY, angle) {
    const playerSize = 5
    const lampColor = '#ff0'
    const playerColor = '#f00'
    const x = Math.floor(playerX * this.cellSize)
    const y = Math.floor(playerY * this.cellSize)
    ctx.fillStyle = playerColor
    ctx.beginPath()
    ctx.arc(x, y, playerSize, angle, angle + CIRCLE)
    ctx.fill()
    ctx.fillStyle = lampColor
    ctx.beginPath()
    ctx.arc(x, y, playerSize, angle + CIRCLE, angle + CIRCLE)
    ctx.arc(x, y, playerSize * 3, angle - 0.15 * Math.PI, angle + 0.15 * Math.PI)
    ctx.fill()
  }
}
