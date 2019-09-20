import { randomMatrix, randomField, create3DMap} from '/utils/maps.js'

export default class Tilemap {
  constructor(matrix = randomMatrix(), cellSize = 250, origin = {x: 0, z: 0}) {
    this.matrix = matrix
    this.cellSize = cellSize
    this.mapSize = (matrix.length - 1) * cellSize
    this.origin = origin
  }

  getFieldValue(x, y) {
    x = Math.floor(x) // eslint-disable-line
    y = Math.floor(y) // eslint-disable-line
    if (x < 0 || x >= this.matrix[0].length || y < 0 || y >= this.matrix.length)
      return -1
    return this.matrix[y][x]
  }

  get randomEmptyField() {
    const [x, y] = randomField(this.matrix)
    if (this.getFieldValue(x, y) === 0) return [x, y]
    return this.randomEmptyField
  }

  /* returns unit vector */
  getPlayerPos(player) {
    return {
      x: (player.x - this.origin.x) / this.mapSize,
      y: (player.z - this.origin.z) / this.mapSize
    }
  }

  create3DMap(yModifier) {
    return create3DMap(this.matrix, this.cellSize, yModifier, this.origin)
  }
}
