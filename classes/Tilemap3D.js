import * as THREE from '/node_modules/three/build/three.module.js'
import {createMap} from '/utils/boxes.js'

export default class Tilemap3D {
  constructor(matrix, cellSize = 250) {
    this.matrix = matrix
    this.cellSize = cellSize
    this.numRows = matrix.length
    this.numColumns = matrix[0].length
    this.height = this.numRows * cellSize
    this.width = this.numColumns * cellSize
    this.mapRange = (matrix.length - 1) * cellSize // pretpostavlja se ishodiste 0
  }

  /* returns unit vector */
  getPlayer2DPos(player) {
    return {
      x: player.x / this.mapRange,
      y: player.z / this.mapRange
    }
  }

  createWalls() {
    return createMap(this.matrix, this.cellSize)
  }

  createFloor() {
    return new THREE.Mesh(
      new THREE.BoxGeometry(this.width, 0, this.width),
      new THREE.MeshLambertMaterial({color: 0xEDCBA0})
    )
  }
}
