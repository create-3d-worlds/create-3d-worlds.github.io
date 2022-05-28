import { randomMatrix, randomField, create3DMap } from '/utils/maps.js'

export default class Tilemap {
  constructor(matrix = randomMatrix(), cellSize = 250, origin) {
    const defaultOrigin = {
      x: -matrix[0].length * cellSize / 2,
      z: -matrix.length * cellSize / 2
    }
    this.matrix = matrix
    this.cellSize = cellSize
    this.mapSize = (matrix.length - 1) * cellSize
    this.origin = origin ? origin : defaultOrigin
  }

  getFieldValue(x, y) {
    x = Math.floor(x) // eslint-disable-line
    y = Math.floor(y) // eslint-disable-line
    if (x < 0 || x >= this.matrix[0].length || y < 0 || y >= this.matrix.length)
      return -1
    return this.matrix[y][x]
  }

  getRelativePos(player) {
    return {
      x: (player.x - this.origin.x) / this.mapSize,
      y: (player.z - this.origin.z) / this.mapSize
    }
  }

  get randomEmptyField() {
    const [x, y] = randomField(this.matrix)
    if (this.getFieldValue(x, y) === 0) return [x, y]
    return this.randomEmptyField
  }

  get randomEmptyPos() {
    const [randFieldX, randFieldZ] = this.randomEmptyField
    const x = randFieldX * this.cellSize + this.origin.x
    const z = randFieldZ * this.cellSize + this.origin.z
    return { x, z }
  }

  create3DMap({ yModifier } = {}) {
    return create3DMap({ matrix: this.matrix, size: this.cellSize, yModifier, origin: this.origin })
  }
}
