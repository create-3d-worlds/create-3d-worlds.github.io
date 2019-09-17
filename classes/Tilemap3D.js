import * as THREE from '/node_modules/three/build/three.module.js'
import {createBox} from '/utils/boxes.js'

const textures = ['concrete.jpg', 'crate.gif', 'brick.png']

export default class Tilemap3D {
  constructor(matrix, cellSize = 250) {
    this.matrix = matrix
    this.cellSize = cellSize
    this.numRows = matrix.length
    this.numColumns = matrix[0].length
    this.height = this.numRows * cellSize
    this.width = this.numColumns * cellSize
  }

  // TODO: prebaciti 3D koordinate lavirinta u canvas koordinate (x, y) sa ihodistem gore levo
  // uzeti u obzir negativne vrednosti
  getMapCoords(v) {
    const x = Math.floor((v.x + this.cellSize / 2) / this.cellSize + this.numColumns / 2)
    const y = Math.floor((v.z + this.cellSize / 2) / this.cellSize + this.numRows / 2)
    return {x, y}
  }

  checkWallCollision(v) {
    const c = this.getMapCoords(v)
    return this.matrix[c.x][c.z] > 0
  }

  createWalls() {
    const group = new THREE.Group()
    this.matrix.forEach((row, z) => row.forEach((val, x) => {
      if (!val) return
      // TODO: pomocna funkciju za pravljenje kocke zida, sa manjom visinom od ostalih stranica
      const wall = createBox(x * this.cellSize, 0, z * this.cellSize, this.cellSize, textures[val - 1])
      group.add(wall)
    }))
    return group
  }

  createFloor() {
    return new THREE.Mesh(
      new THREE.BoxGeometry(this.width, 0, this.width),
      new THREE.MeshLambertMaterial({color: 0xEDCBA0})
    )
  }
}
