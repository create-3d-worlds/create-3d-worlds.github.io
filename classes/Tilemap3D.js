import {randomMatrix, createMap} from '/utils/maps.js'

export default class Tilemap3D {
  constructor(matrix = randomMatrix(), cellSize = 250, origin = {x: 0, z: 0}) {
    this.matrix = matrix
    this.cellSize = cellSize
    this.mapSize = (matrix.length - 1) * cellSize
    this.origin = origin
  }

  /* returns unit vector */
  getPlayerPos(player) {
    return {
      x: (player.x - this.origin.x) / this.mapSize,
      y: (player.z - this.origin.z) / this.mapSize
    }
  }

  createWalls(yModifier) {
    return createMap(this.matrix, this.cellSize, yModifier, this.origin)
  }
}
