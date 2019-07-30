import Canvas from '../utils/Canvas.js'

const {ctx} = new Canvas()
const colors = ['#fff', '#444', '#701206', '#000']

export default class Tilemap {
  constructor(model, cellSize = 30) {
    this.model = model
    if (!model) this.random()
    this.cellSize = cellSize
    this.height = this.model.length * cellSize
    this.width = this.model[0].length * cellSize
  }

  random(size = 10) {
    const wallPercent = 0.3
    this.model = []
    for (let y = 0; y < size; y++) {
      this.model[y] = []
      for (let x = 0; x < size; x++)
        this.model[y][x] = Math.random() < wallPercent ? 1 : 0
    }
  }

  daj(x, y) {
    x = Math.floor(x) // eslint-disable-line
    y = Math.floor(y) // eslint-disable-line
    if (x < 0 || x >= this.model[0].length || y < 0 || y >= this.model.length) return -1
    return this.model[y][x]
  }

  nadjiPolje(x, y) {
    const poljeX = Math.floor(x / this.cellSize)
    const poljeY = Math.floor(y / this.cellSize)
    return { 'y': poljeY, 'x': poljeX }
  }

  render() {
    for (let y = 0; y < this.model.length; y++)
      for (let x = 0; x < this.model[y].length; x++) {
        const eNum = this.model[y][x]
        ctx.fillStyle = colors[eNum]
        ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
      }
  }
}
