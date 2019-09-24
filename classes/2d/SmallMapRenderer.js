import Canvas from './Canvas.js'

const colors = ['#fff', '#444', '#701206', '#000']

export default class SmallMapRenderer extends Canvas {
  // constructor(color = 'transparent') {
  //   super(color)
  // }

  drawMap(matrix, cellSize) {
    matrix.forEach((row, y) => row.forEach((val, x) =>
      this.drawRect(x, y, cellSize, colors[val])
    ))
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

  drawPlayerOnMap(x, y, angle) {
    this.drawCircle(x, y)
    this.drawLamp(x, y, angle)
  }
}

customElements.define('small-map', SmallMapRenderer, { extends: 'canvas' })
