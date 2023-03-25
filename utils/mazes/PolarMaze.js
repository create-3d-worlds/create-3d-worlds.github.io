import Maze from './Maze.js'
import PolarCell from './PolarCell.js'
import { meshFromPolarMaze, createPipe, createCityWall, createWall } from '/utils/mazes.js'

export default class PolarMaze extends Maze {
  constructor(rows, algorithm, cellSize = 10) {
    super(rows, 1, algorithm, cellSize)
  }

  /* GETTERS */

  get random_cell() {
    const row = Math.floor(Math.random() * this.rows)
    const col = Math.floor(Math.random() * this.grid[row].length)
    return this.cell(row, col)
  }

  cell(row, column) {
    if (row < 0 || row > this.rows - 1) return null
    return this.grid[row][column % this.grid[row].length]
  }

  /* UTILS */

  createGrid(rows) {
    const grid = new Array(rows)
    const row_height = 1 / rows
    grid[0] = [new PolarCell(0, 0)]

    for (let i = 1; i < rows; i += 1) {
      const radius = i * 1 / rows
      const circumference = 2 * Math.PI * radius

      const previous_count = grid[i - 1].length
      const estimated_cell_width = circumference / previous_count
      const ratio = Math.round(estimated_cell_width / row_height)

      const cells = previous_count * ratio
      grid[i] = new Array(cells)
      for (let j = 0; j < cells; j += 1)
        grid[i][j] = new PolarCell(i, j)
    }

    for (const row of grid)
      for (const cell of row) {
        const { row, column } = cell
        if (row == 0) continue

        cell.cw = grid[row][column + 1]
        cell.ccw = grid[row][column - 1]
        const ratio = grid[row].length / grid[row - 1].length
        const parent = grid[row - 1][Math.floor(column / ratio)]
        parent.outward.push(cell)
        cell.inward = parent
      }

    return grid
  }

  putPlayer(player) {
    const mazeSize = this.rows * this.cellSize
    player.position = { x: this.cellSize * .5, y: 0, z: -mazeSize - this.cellSize }
    player.mesh.lookAt(0, 0, -mazeSize * 2)
  }

  /* RENDER */

  toMesh(params = {}) {
    return meshFromPolarMaze({ ...params, maze: this, cellSize: this.cellSize })
  }

  toCity(params = {}) {
    return this.toMesh({ connect: createCityWall, color: 0xffffff, ...params })
  }

  toPipes(params = {}) {
    return this.toMesh({ connect: createPipe, color: 'gray', ...params })
  }

  toRuins(params = {}) {
    return this.toMesh({ connect: createWall, color: 'white', ...params })
  }
}