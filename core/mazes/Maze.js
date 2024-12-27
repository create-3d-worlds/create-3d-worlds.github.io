import { sample, shuffle } from '/core/helpers.js'
import { meshFromMaze, meshFromTilemap, tileToPosition, calcPyramidHeight } from '/core/mazes/index.js'
import { recursiveBacktracker } from '/core/mazes/algorithms.js'
import Cell from './Cell.js'

const EMPTY = 0, WALL = 1

function getEmptyTiles(tilemap, skipFirst = false) {
  const fields = []
  tilemap.forEach((row, z) => row.forEach((value, x) => {
    if (skipFirst && z === 1 && x === 1) return
    if (value < 1) fields.push([z, x])
  }))
  return fields
}

/**
 * Create a perfect maze with an algorithm, render maze in various ways, etc.
 * (nice algorithms: aldousBroder, wilsons, recursiveBacktracker)
 * credits to Jamis Buck: Mazes for Programmers
 */
export default class Maze {
  constructor(rows = 20, columns = rows, algorithm = recursiveBacktracker, cellSize = 3) {
    this.rows = rows
    this.columns = columns
    this.cellSize = cellSize
    this.grid = this.createGrid(rows, columns)
    if (algorithm) algorithm(this)
  }

  /* GETTERS */

  get size() {
    return this.rows * this.columns
  }

  set distances(distances) {
    this._distances = distances
    const [_, maximum] = distances.max()
    this.maximum = maximum
  }

  get distances() {
    return this._distances
  }

  get first_cell() {
    return this.cell(0, 0)
  }

  get middle_cell() {
    return this.cell(Math.floor(this.rows / 2), Math.floor(this.columns / 2))
  }

  get last_cell() {
    return this.cell(this.rows - 1, this.columns - 1)
  }

  get random_cell() {
    const row = Math.floor(Math.random() * this.rows)
    const column = Math.floor(Math.random() * this.grid[row].length)
    return this.cell(row, column)
  }

  get tilemap() {
    const tilemap = [[...Array(this.columns * 2 + 1).keys()].map(() => WALL)] // first row
    for (const row of this.grid) {
      const top = [WALL]
      const bottom = [WALL]
      for (const cell of row) {
        if (!cell) continue
        const val = this.distances?.get(cell) !== undefined
          ? -this.distances?.get(cell) // signed int for distances
          : EMPTY
        const east_boundary = cell.linked(cell.east) ? EMPTY : WALL
        top.push(val, east_boundary)
        const south_boundary = cell.linked(cell.south) ? EMPTY : WALL
        const corner = WALL
        bottom.push(south_boundary, corner)
      }
      tilemap.push(top)
      tilemap.push(bottom)
    }
    // tilemap[0][1] = EMPTY // enter
    tilemap[tilemap.length - 1][tilemap[0].length - 2] = EMPTY // exit
    return tilemap
  }

  get exitPosition() {
    return this.tilePosition(this.tilemap.length - 1, this.tilemap.length - 2)
  }

  cell(row, column) {
    if (row < 0 || row > this.rows - 1) return null
    if (column < 0 || column > this.grid[row].length - 1) return null
    return this.grid[row][column]
  }

  tilePosition(row, column) {
    return tileToPosition(this.tilemap, [row, column], this.cellSize)
  }

  /* UTILS */

  createGrid(rows, columns) {
    const grid = new Array(rows)
    for (let i = 0; i < rows; i += 1) {
      grid[i] = new Array(columns)
      for (let j = 0; j < columns; j += 1)
        grid[i][j] = new Cell(i, j)
    }

    for (const row of grid)
      for (const cell of row) {
        const { row, column: col } = cell
        if (row > 0) cell.north = grid[row - 1][col]
        if (row < rows - 1) cell.south = grid[row + 1][col]
        if (col > 0) cell.west = grid[row][col - 1]
        if (col < columns - 1) cell.east = grid[row][col + 1]
      }

    return grid
  }

  * each_row() {
    for (const row of this.grid)
      if (row) yield row
  }

  * each_cell() {
    for (const row of this.grid)
      for (const cell of row)
        if (cell) yield cell
  }

  /* remove deadends */
  braid(percent = 0.5) {
    for (const cell of this.each_cell()) {
      if (cell.links_length != 1 || Math.random() > percent)
        continue

      const unlinked = cell.neighbors.filter(c => !c.linked(cell))
      const unlinkedOneway = unlinked.filter(c => c.links_length == 1)
      const best = unlinkedOneway.length ? unlinkedOneway : unlinked

      cell.link(sample(best))
    }
  }

  getEmptyCoords(skipFirst) {
    const fields = getEmptyTiles(this.tilemap, skipFirst)
    shuffle(fields)
    return fields.map(field => tileToPosition(this.tilemap, field, this.cellSize))
  }

  /* RENDER */

  toString() {
    let output = ''
    output += '+' + '---+'.repeat(this.columns) + '\n'
    for (const row of this.grid) {
      let top = '|'
      let bottom = '+'
      for (const cell of row) {
        if (!cell) continue
        const body = ` ${this.distances?.get(cell) || ' '} `
        const east_boundary = cell.linked(cell.east) ? ' ' : '|'
        top += body + east_boundary
        const south_boundary = cell.linked(cell.south) ? '   ' : '---'
        const corner = '+'
        bottom += south_boundary + corner
      }
      output += top + '\n' + bottom + '\n'
    }
    return output
  }

  toMesh(params = {}) {
    return meshFromMaze({ ...params, maze: this, cellSize: this.cellSize })
  }

  toTiledMesh(params = {}) {
    return meshFromTilemap({ ...params, tilemap: this.tilemap, cellSize: this.cellSize })
  }

  toCity(params = {}) {
    return this.toTiledMesh({ city: true, maxHeight: 0, cityTexture: true, ...params })
  }

  toPyramid(params = {}) {
    return this.toTiledMesh({ maxHeight: this.cellSize * this.tilemap.length * .33, calcHeight: calcPyramidHeight, ...params })
  }
}