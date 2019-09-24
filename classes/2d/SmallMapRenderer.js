import Canvas from './Canvas.js'

const CIRCLE = Math.PI * 2
const colors = ['#fff', '#444', '#701206', '#000']

export default class SmallMapRenderer extends Canvas {
  constructor(matrix, cellSize = 25) {
    super()
    this.matrix = matrix
    this.cellSize = cellSize
    this.width = this.height = matrix.length * cellSize
  }

  drawRect(x, y, size, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x * size, y * size, size, size)
  }

  drawMap() {
    this.matrix.forEach((row, y) => row.forEach((val, x) =>
      this.drawRect(x, y, this.cellSize, colors[val])
    ))
  }

  drawCircle(x, y, radius = 5, color = '#f00') {
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, CIRCLE)
    this.ctx.fill()
  }

  drawLamp(x, y, angle, radius = 5, color = '#ff0') {
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, angle, angle)
    this.ctx.arc(x, y, radius * 3, angle - 0.15 * Math.PI, angle + 0.15 * Math.PI)
    this.ctx.fill()
  }

  drawPlayerOnMap(x, y, angle) {
    this.drawCircle(x, y)
    this.drawLamp(x, y, angle)
  }

  draw2DPlayerOnMap(player) {
    const x = player.x * player.map.cellSize
    const y = player.y * player.map.cellSize
    this.drawPlayerOnMap(x, y, player.angle)
  }

  draw3DPlayerOnMap(player, map, smallMap) {
    const pos = map.getRelativePos(player)
    const x = pos.x * smallMap.mapSize + smallMap.cellSize / 2
    const y = pos.y * smallMap.mapSize + smallMap.cellSize / 2
    this.drawPlayerOnMap(x, y, player.angle)
  }
}

customElements.define('my-small-map', SmallMapRenderer, { extends: 'canvas' })
