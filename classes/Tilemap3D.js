import * as THREE from '/node_modules/three/build/three.module.js'

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
    const wallHeight = this.cellSize / 2
    const loader = new THREE.TextureLoader()
    const cube = new THREE.BoxGeometry(this.cellSize, wallHeight, this.cellSize)
    const materials = [
      new THREE.MeshLambertMaterial({map: loader.load('/assets/textures/wall-1.jpg')}),
      new THREE.MeshLambertMaterial({map: loader.load('/assets/textures/concrete.jpg')}),
      new THREE.MeshLambertMaterial({color: 0xFBEBCD}),
    ]
    for (let i = 0; i < this.numRows; i++)
      for (let j = 0, m = this.numColumns; j < m; j++) {
        if (!this.matrix[i][j]) continue
        const wall = new THREE.Mesh(cube, materials[this.matrix[i][j] - 1])
        wall.position.x = (i - this.numColumns / 2) * this.cellSize
        wall.position.y = wallHeight / 2
        wall.position.z = (j - this.numColumns / 2) * this.cellSize
        console.log(wall.position.x) // TODO: uzeti u obzir raspon x, z koordinata za getMapCoords
        group.add(wall)
      }
    return group
  }

  createFloor() {
    return new THREE.Mesh(
      new THREE.BoxGeometry(this.width, 0, this.width),
      new THREE.MeshLambertMaterial({color: 0xEDCBA0})
    )
  }
}
