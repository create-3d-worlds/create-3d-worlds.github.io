import {createMap} from '/utils/boxes.js'

export default class Tilemap3D {
  constructor(matrix, cellSize = 250, origin = 0) {
    this.matrix = matrix
    this.cellSize = cellSize
    this.origin = origin
    this.numRows = matrix.length
    this.numColumns = matrix[0].length
    this.mapRange = (matrix.length - 1) * cellSize - origin
  }

  /* returns unit vector */
  getPlayerPos(player) {
    return {
      x: player.x / this.mapRange,
      y: player.z / this.mapRange
    }
  }

  createWalls(yModifier) {
    // TODO: upotrebiti this.origin
    return createMap(this.matrix, this.cellSize, yModifier, this.origin)
  }
}
