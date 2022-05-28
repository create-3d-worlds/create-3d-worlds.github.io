import * as THREE from '/node_modules/three119/build/three.module.js'
import { createBox } from '/utils/boxes.js'

export function randomMatrix(size = 10, wallPercent = .3) {
  const matrix = []
  for (let y = 0; y < size; y++) {
    matrix[y] = []
    for (let x = 0; x < size; x++)
      matrix[y][x] = Math.random() < wallPercent ? 1 : 0
  }
  return matrix
}

export function create3DMap({ matrix = randomMatrix(), size = 1, yModifier, origin } = {}) {
  const defaultOrigin = {
    x: -matrix[0].length * size / 2,
    z: -matrix.length * size / 2
  }
  origin = origin || defaultOrigin // eslint-disable-line no-param-reassign
  const textures = ['concrete.jpg', 'crate.gif', 'brick.png']
  const group = new THREE.Group()
  matrix.forEach((row, rowIndex) => row.forEach((val, columnIndex) => {
    if (!val) return
    const x = (columnIndex * size) + origin.x
    const z = (rowIndex * size) + origin.z
    group.add(createBox({ x, z, size, file: textures[val - 1], yModifier }))
  }))
  return group
}

export function randomField(matrix) {
  const y = Math.floor(Math.random() * matrix.length)
  const x = Math.floor(Math.random() * matrix[0].length)
  return [x, y]
}

export const getMapPosition = ({ obj, map, cellSize }) => {
  const mapWidth = map.length
  const mapHeight = map[0].length
  return {
    x: Math.floor((obj.x + cellSize / 2) / cellSize + mapHeight / 2),
    z: Math.floor((obj.z + cellSize / 2) / cellSize + mapWidth / 2)
  }
}