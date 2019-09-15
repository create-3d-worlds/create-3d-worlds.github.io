const CIRCLE = Math.PI * 2
const colors = ['#fff', '#444', '#701206', '#000']

export default class Canvas extends HTMLCanvasElement {
  constructor() {
    super()
    this.height = window.innerHeight || 600 // height must first
    this.width = document.body.clientWidth || 800
    this.style.backgroundColor = 'lightgray'
    document.body.style.margin = 0
    document.body.style.padding = 0
    document.body.appendChild(this)
  }

  connectedCallback() {
    this.focus()
  }

  get ctx() {
    return this.getContext('2d')
  }

  get diagonal() {
    return Math.sqrt(this.height * this.height + this.width * this.width)
  }

  hide() {
    this.style.display = 'none'
  }

  show() {
    this.style.display = 'block'
  }

  drawCircle(x, y, radius, color) {
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, CIRCLE)
    this.ctx.fill()
  }

  drawLamp(x, y, radius, angle, color) {
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, angle, angle)
    this.ctx.arc(x, y, radius * 3, angle - 0.15 * Math.PI, angle + 0.15 * Math.PI)
    this.ctx.fill()
  }

  drawRect(x, y, size, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x * size, y * size, size, size)
  }

  renderMap(matrix, cellSize) {
    matrix.forEach((row, y) => row.forEach((val, x) =>
      this.drawRect(x, y, cellSize, colors[val])
    ))
  }

  renderPlayer(player) {
    const size = 5
    const x = Math.floor(player.x * player.map.cellSize)
    const y = Math.floor(player.y * player.map.cellSize)
    this.drawCircle(x, y, size, '#f00')
    this.drawLamp(x, y, size, player.angle, '#ff0')
  }
}

customElements.define('my-canvas', Canvas, { extends: 'canvas' })
