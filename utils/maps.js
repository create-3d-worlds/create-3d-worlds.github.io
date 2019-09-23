import * as THREE from '/node_modules/three/build/three.module.js'
import {createWallBlock} from '/utils/boxes.js'

export function randomMatrix(size = 10, wallPercent = .3) {
  const matrix = []
  for (let y = 0; y < size; y++) {
    matrix[y] = []
    for (let x = 0; x < size; x++)
      matrix[y][x] = Math.random() < wallPercent ? 1 : 0
  }
  return matrix
}

export function create3DMap(matrix = randomMatrix(), size = 5, yModifier, origin = { x: 0, z: 0 }) {
  const textures = ['concrete.jpg', 'crate.gif', 'brick.png']
  const group = new THREE.Group()
  matrix.forEach((row, rowIndex) => row.forEach((val, columnIndex) => {
    if (!val) return
    const x = (columnIndex * size) + origin.x
    const z = (rowIndex * size) + origin.z
    group.add(createWallBlock(x, z, size, textures[val - 1], yModifier))
  }))
  return group
}

export function randomField(matrix) {
  const y = Math.floor(Math.random() * matrix.length)
  const x = Math.floor(Math.random() * matrix[0].length)
  return [x, y]
}
