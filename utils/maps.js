import * as THREE from '/node_modules/three127/build/three.module.js'
import { createBox } from '/utils/geometry.js'

export function randomMatrix(size = 10, wallPercent = .3) {
  const matrix = []
  for (let y = 0; y < size; y++) {
    matrix[y] = []
    for (let x = 0; x < size; x++)
      matrix[y][x] = Math.random() < wallPercent ? 1 : 0
  }
  return matrix
}

export function create3DMap({ matrix = randomMatrix(), size = 1, yModifier } = {}) {
  const origin = {
    x: -matrix[0].length * size / 2,
    z: -matrix.length * size / 2
  }
  const textures = ['concrete.jpg', 'crate.gif', 'brick.png']
  const group = new THREE.Group()
  matrix.forEach((row, rowIndex) => row.forEach((val, columnIndex) => {
    if (!val) return
    const x = (columnIndex * size) + origin.x
    const z = (rowIndex * size) + origin.z
    const box = createBox({ x, z, size, file: textures[val - 1], yModifier })
    box.position.set(x, 0, z)
    group.add(box)
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

/*
  Prim's Algorithm
  https://stackoverflow.com/questions/54613229
*/
const WALL = 1
const EMPTY = 0

export default function generateMaze(cols = 60, rows = 60) {
  // 1. Start with a grid full of walls.
  const maze = []
  for (let i = 0; i < cols; i++) {
    maze.push([])
    for (let j = 0; j < rows; j++)
      maze[i][j] = WALL
  }

  // 2. Pick a cell, mark it as part of the maze.
  const cell = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  }
  maze[cell.x][cell.y] = EMPTY

  // 2.1 Add the walls of the cell to the wall list.
  const walls = []
  if (cell.x + 1 < cols) walls.push({
    x: cell.x + 1,
    y: cell.y
  })
  if (cell.x - 1 >= 0) walls.push({
    x: cell.x - 1,
    y: cell.y
  })
  if (cell.y + 1 < rows) walls.push({
    x: cell.x,
    y: cell.y + 1
  })
  if (cell.y - 1 >= 0) walls.push({
    x: cell.x,
    y: cell.y - 1
  })

  // 3. While there are walls in the list:
  while (walls.length > 0) {

    // 3.1 Pick a random wall from the list.
    const wallIndex = Math.floor(Math.random() * walls.length)
    const wall = walls[wallIndex]

    // 3.2 If only one of the two cells that the wall divides is visited, then:
    const uc = [] // unvisited cell

    if (wall.x + 1 < cols && maze[wall.x + 1][wall.y] === EMPTY) uc.push({
      x: wall.x - 1,
      y: wall.y
    })
    if (wall.x - 1 >= 0 && maze[wall.x - 1][wall.y] === EMPTY) uc.push({
      x: wall.x + 1,
      y: wall.y
    })
    if (wall.y + 1 < rows && maze[wall.x][wall.y + 1] === EMPTY) uc.push({
      x: wall.x,
      y: wall.y - 1
    })
    if (wall.y - 1 >= 0 && maze[wall.x][wall.y - 1] === EMPTY) uc.push({
      x: wall.x,
      y: wall.y + 1
    })

    if (uc.length === 1) {
      // 3.2.1 Make the wall a passage and mark the unvisited cell as part of the maze.
      maze[wall.x][wall.y] = EMPTY
      if (uc[0].x >= 0 && uc[0].x < cols && uc[0].y >= 0 && uc[0].y < rows) {
        maze[uc[0].x][uc[0].y] = EMPTY

        // 3.2.2 Add the neighboring walls of the cell to the wall list.
        if (uc[0].x + 1 < cols && maze[uc[0].x + 1][uc[0].y] === WALL) walls.push({
          x: uc[0].x + 1,
          y: uc[0].y
        })
        if (uc[0].x - 1 >= 0 && maze[uc[0].x - 1][uc[0].y] === WALL) walls.push({
          x: uc[0].x - 1,
          y: uc[0].y
        })
        if (uc[0].y + 1 < rows && maze[uc[0].x][uc[0].y + 1] === WALL) walls.push({
          x: uc[0].x,
          y: uc[0].y + 1
        })
        if (uc[0].y - 1 >= 0 && maze[uc[0].x][uc[0].y - 1] === WALL) walls.push({
          x: uc[0].x,
          y: uc[0].y - 1
        })
      }
    }
    // 3.3 Remove the wall from the list.
    walls.splice(wallIndex, 1)
  }
  return maze
}
