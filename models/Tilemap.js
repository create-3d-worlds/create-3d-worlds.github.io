import canvas from './Canvas.js'

export default class Tilemap {
  constructor(model, cellSize = 30) {
    this.model = model
    if (!model) this.randomMap()
    this.cellSize = cellSize
    this.height = model.length * cellSize
    this.width = this.model[0].length * cellSize
  }

  // could be without exit, implement maze alghoritm
  randomMap(size = 10) {
    const wallPercent = 0.3
    this.model = []
    for (let y = 0; y < size; y++) {
      this.model[y] = []
      for (let x = 0; x < size; x++)
        this.model[y][x] = Math.random() < wallPercent ? 1 : 0
    }
  }

  getValue(x, y) {
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
    if (this.getValue(x, y) === 0) return {x, y}
    return this.randomEmptyField
  }

  render() {
    this.model.forEach((row, y) => row.forEach((val, x) =>
      canvas.drawRect(x, y, this.cellSize, val)
    ))
  }
}
