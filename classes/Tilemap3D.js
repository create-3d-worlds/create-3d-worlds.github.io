import * as THREE from '/node_modules/three/build/three.module.js'
import {createMap} from '/utils/boxes.js'

export default class Tilemap3D {
  constructor(matrix, cellSize = 250, origin = 0) {
    this.matrix = matrix
    this.cellSize = cellSize
    this.origin = origin
    this.numRows = matrix.length
    this.numColumns = matrix[0].length
    this.height = this.numRows * cellSize
    this.width = this.numColumns * cellSize
    this.mapRange = (matrix.length - 1) * cellSize - origin
  }

  /* returns unit vector */
  getPlayer2DPos(player) {
    return {
      x: player.x / this.mapRange,
      y: player.z / this.mapRange
    }
  }

  createWalls(yModifier) {
    // TODO: upotrebiti this.origin
    return createMap(this.matrix, this.cellSize, yModifier)
  }

  createFloor() {
    return new THREE.Mesh(
      new THREE.BoxGeometry(this.width, 0, this.height),
      new THREE.MeshLambertMaterial({color: 0xEDCBA0})
    )
  }
}
