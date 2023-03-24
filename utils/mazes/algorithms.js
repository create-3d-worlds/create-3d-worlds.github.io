import { sample, shuffle } from '/utils/helpers.js'

/* BINARY TREE */

export function binaryTree(maze) {
  for (const cell of maze.each_cell()) {
    const neighbors = []
    if (cell.north) neighbors.push(cell.north)
    if (cell.east) neighbors.push(cell.east)
    const neighbor = sample(neighbors)
    if (neighbor) cell.link(neighbor)
  }
}

/* SIDEWINDER */

export function sideWinder(maze) {
  for (const row of maze.each_row()) {
    let run = []
    for (const cell of row) {
      run.push(cell)
      const should_close_out = !cell.east || (cell.north && Math.random() < 0.5)
      if (should_close_out) {
        const member = sample(run)
        if (member.north) member.link(member.north)
        run = []
      } else
        cell.link(cell.east)
    }
  }
}

/* ALDOUS BRODER */

export function aldousBroder(maze) {
  let cell = maze.random_cell
  let unvisited = maze.size - 1

  while (unvisited) {
    const neighbor = sample(cell.neighbors)
    if (!neighbor.links_length) {
      cell.link(neighbor)
      unvisited -= 1
    }
    cell = neighbor
  }
}

/* WILSONS */

export function wilsons(maze) {
  let unvisited = []
  for (const cell of maze.each_cell()) unvisited.push(cell)

  const first = sample(unvisited)
  unvisited = unvisited.filter(cell => cell.id !== first.id)

  while (unvisited.length) {
    let cell = sample(unvisited)
    let path = [cell]

    while (unvisited.some(x => x.id === cell.id)) {
      const { neighbors } = cell
      cell = sample(neighbors)
      const index = path.findIndex(x => x.id === cell.id)
      if (index != -1)
        path = path.slice(0, index + 1)
      else
        path.push(cell)
    }

    for (let i = 0; i <= path.length - 2; i += 1) {
      path[i].link(path[i + 1])
      unvisited = unvisited.filter(cell => cell.id !== path[i].id)
    }
  }
}

/* HUNT AND KILL */

export function huntAndKill(maze) {
  let current = maze.random_cell

  while (current) {
    const unvisited_neighbors = current.neighbors.filter(cell => cell.unvisited)
    let neighbor
    let visited_neighbors

    if (unvisited_neighbors.length) {
      neighbor = sample(unvisited_neighbors)
      current.link(neighbor)
      current = neighbor
    } else {
      current = null
      for (const cell of maze.each_cell()) {
        visited_neighbors = cell.neighbors.filter(cell => cell.links_length)
        if (cell.unvisited && visited_neighbors.length) {
          current = cell
          neighbor = sample(visited_neighbors)
          current.link(neighbor)
          break
        }
      }
    }
  }
}

/* RECURSIVE BACKTRACKER (depth-first search) */

export function recursiveBacktracker(maze, start_at = maze.random_cell) {
  const stack = [start_at]

  while (stack.length) {
    const current = stack[stack.length - 1]
    const neighbors = current.neighbors.filter(cell => cell.unvisited)
    if (!neighbors.length)
      stack.pop()
    else {
      const neighbor = sample(neighbors)
      current.link(neighbor)
      stack.push(neighbor)
    }
  }
}

/* PRIM'S */

export function simplifiedPrims(maze, start_at = maze.random_cell) {
  let active = []
  active.push(start_at)

  while (active.length) {
    const cell = sample(active)
    const available_neighbors = cell.neighbors.filter(c => c.unvisited)

    if (available_neighbors.length) {
      const neighbor = sample(available_neighbors)
      cell.link(neighbor)
      active.push(neighbor)
    } else
      active = active.filter(c => c.id != cell.id)
  }
}

export function truePrims(maze, start_at = maze.random_cell) {
  let active = []
  active.push(start_at)
  const costs = {}

  for (const cell of maze.each_cell())
    costs[cell.id] = Math.floor(Math.random() * 100)

  while (active.length) {
    active.sort((a, b) => costs[a.id] - costs[b.id])
    const cell = active[0]
    const available_neighbors = cell.neighbors.filter(c => c.unvisited)
    if (available_neighbors.length) {
      available_neighbors.sort((a, b) => costs[a.id] - costs[b.id])
      const neighbor = available_neighbors[0]
      cell.link(neighbor)
      active.push(neighbor)
    } else
      active = active.filter(c => c.id != cell.id)
  }
}

/* ELER'S */

class RowState {
  constructor(starting_set = 0) {
    this.cells_in_set = {}
    this.set_for_cell = []
    this.next_set = starting_set
  }

  record(set, cell) {
    this.set_for_cell[cell.column] = set

    if (!this.cells_in_set.hasOwnProperty(set)) this.cells_in_set[set] = []
    this.cells_in_set[set].push(cell)
  }

  set_for(cell) {
    if (!this.set_for_cell[cell.column]) {
      this.record(this.next_set, cell)
      this.next_set += 1
    }

    return this.set_for_cell[cell.column]
  }

  merge(winner, loser) {
    for (let i = 0; i < this.cells_in_set[loser].length; i += 1) {
      const cell = this.cells_in_set[loser][i]
      this.set_for_cell[cell.column] = winner
      this.cells_in_set[winner].push(cell)
    }
    delete this.cells_in_set[loser]
  }

  next() {
    return new RowState(this.next_set)
  }

  * each_set() {
    for (const [set, cells] of Object.entries(this.cells_in_set))
      yield [set, cells]
  }
}

export function ellers(maze) {
  let row_state = new RowState()

  for (const row of maze.each_row()) {
    for (const cell of row) {
      if (!cell.west) continue
      const set = row_state.set_for(cell)
      const prior_set = row_state.set_for(cell.west)

      const should_link = set != prior_set && (cell.south == null || Math.random() < 0.5)
      if (should_link) {
        cell.link(cell.west)
        row_state.merge(prior_set, set)
      }
    }

    if (row[0].south) {
      const next_row = row_state.next()
      for (const [set, cells] of row_state.each_set()) {
        shuffle(cells)
        cells.forEach((cell, i) => {
          if (i == 0 || Math.random() < 0.33) {
            cell.link(cell.south)
            next_row.record(row_state.set_for(cell), cell.south)
          }
        })
      }
      row_state = next_row
    }
  }
}

/* RECURSIVE DIVISION */

function divide(maze, row, column, height, width) {
  if (height <= 1 || width <= 1 || height < 5 && width < 5 && Math.random() < 0.25) return

  if (height > width)
    divide_horizontally(maze, row, column, height, width)
  else
    divide_vertically(maze, row, column, height, width)
}

function divide_horizontally(maze, row, column, height, width) {
  const divide_south_of = Math.floor(Math.random() * (height - 1))
  const passage_at = Math.floor(Math.random() * width)

  for (let x = 0; x < width; x += 1) {
    if (passage_at == x) continue
    const cell = maze.cell(row + divide_south_of, column + x)
    cell.unlink(cell.south)
  }

  divide(maze, row, column, divide_south_of + 1, width)
  divide(maze, row + divide_south_of + 1, column, height - divide_south_of - 1, width)
}

function divide_vertically(maze, row, column, height, width) {
  const divide_east_of = Math.floor(Math.random() * (width - 1))
  const passage_at = Math.floor(Math.random() * height)

  for (let y = 0; y < height; y += 1) {
    if (passage_at == y) continue
    const cell = maze.cell(row + y, column + divide_east_of)
    cell.unlink(cell.east)
  }

  divide(maze, row, column, height, divide_east_of + 1)
  divide(maze, row, column + divide_east_of + 1, height, width - divide_east_of - 1)
}

export function recursiveDivision(maze) {
  for (const cell of maze.each_cell())
    cell.neighbors.forEach(c => cell.link(c, false)) // removing all interior walls

  divide(maze, 0, 0, maze.rows, maze.columns)
}
