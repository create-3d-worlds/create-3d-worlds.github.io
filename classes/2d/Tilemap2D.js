import {randomMatrix, randomField} from '/utils/maps.js'

export default class Tilemap2D {
  constructor(matrix = randomMatrix(), cellSize = 30) {
    this.matrix = matrix
    this.cellSize = cellSize
    this.mapSize = (matrix.length - 1) * cellSize
  }

  getValue(x, y) {
    x = Math.floor(x) // eslint-disable-line
    y = Math.floor(y) // eslint-disable-line
    if (x < 0 || x >= this.matrix[0].length || y < 0 || y >= this.matrix.length)
      return -1
    return this.matrix[y][x]
  }

  get randomEmptyField() {
    const [x, y] = randomField(this.matrix)
    if (this.getValue(x, y) === 0) return {x, y}
    return this.randomEmptyField
  }
}
