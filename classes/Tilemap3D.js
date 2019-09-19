import {createMap} from '/utils/boxes.js'

export default class Tilemap3D {
  constructor(matrix, cellSize = 250, origin = {x: 0, z: 0}) {
    this.matrix = matrix
    this.cellSize = cellSize
    this.origin = origin
    this.mapSize = (matrix.length - 1) * cellSize
    console.log(this.mapSize)
  }

  /* returns unit vector */
  getPlayerPos(player) {
    return {
      x: player.x / this.mapSize,
      y: player.z / this.mapSize
    }
  }

  createWalls(yModifier) {
    return createMap(this.matrix, this.cellSize, yModifier, this.origin)
  }
}
