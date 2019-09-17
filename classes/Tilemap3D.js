import * as THREE from '/node_modules/three/build/three.module.js'

export default class Tilemap3D {
  constructor(matrix, cellSize = 250) {
    this.matrix = matrix
    this.cellSize = cellSize
    this.mHeight = matrix.length
    this.mWidth =  matrix[0].length
    this.height = this.mHeight * cellSize
    this.width = this.mWidth * cellSize
  }

  getMapSector(v) {
    const x = Math.floor((v.x + this.cellSize / 2) / this.cellSize + this.mWidth / 2)
    const z = Math.floor((v.z + this.cellSize / 2) / this.cellSize + this.mHeight / 2)
    return {x, z}
  }

  checkWallCollision(v) {
    const c = this.getMapSector(v)
    return this.matrix[c.x][c.z] > 0
  }

  createWalls() {
    const group = new THREE.Group()
    const wallHeight = this.cellSize / 3
    const loader = new THREE.TextureLoader()
    const cube = new THREE.BoxGeometry(this.cellSize, wallHeight, this.cellSize)
    const materials = [
      new THREE.MeshLambertMaterial({map: loader.load('/assets/textures/wall-1.jpg')}),
      new THREE.MeshLambertMaterial({map: loader.load('/assets/textures/concrete.jpg')}),
      new THREE.MeshLambertMaterial({color: 0xFBEBCD}),
    ]
    for (let i = 0; i < this.mHeight; i++)
      for (let j = 0, m = this.mWidth; j < m; j++) {
        if (!this.matrix[i][j]) continue
        const wall = new THREE.Mesh(cube, materials[this.matrix[i][j] - 1])
        wall.position.x = (i - this.mWidth / 2) * this.cellSize
        wall.position.y = wallHeight / 2
        wall.position.z = (j - this.mWidth / 2) * this.cellSize
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
