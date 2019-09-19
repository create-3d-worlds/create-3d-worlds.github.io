export default class Tilemap2D {
  constructor(matrix, cellSize = 30) {
    this.matrix = matrix
    if (!matrix) this.randomMap()
    this.cellSize = cellSize
    this.mapRange = (matrix.length - 1) * cellSize
  }

  randomMap(size = 10) {
    const wallPercent = 0.3
    this.matrix = []
    for (let y = 0; y < size; y++) {
      this.matrix[y] = []
      for (let x = 0; x < size; x++)
        this.matrix[y][x] = Math.random() < wallPercent ? 1 : 0
    }
  }

  getValue(x, y) {
    x = Math.floor(x) // eslint-disable-line
    y = Math.floor(y) // eslint-disable-line
    if (x < 0 || x >= this.matrix[0].length || y < 0 || y >= this.matrix.length)
      return -1
    return this.matrix[y][x]
  }

  get randomField() {
    const y = Math.floor(Math.random() * this.matrix.length)
    const x = Math.floor(Math.random() * this.matrix[0].length)
    return {x, y}
  }

  get randomEmptyField() {
    const {x, y} = this.randomField
    if (this.getValue(x, y) === 0) return {x, y}
    return this.randomEmptyField
  }
}
