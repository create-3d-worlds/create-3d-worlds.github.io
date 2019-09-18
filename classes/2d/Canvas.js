const CIRCLE = Math.PI * 2
const colors = ['#fff', '#444', '#701206', '#000']

export default class Canvas extends HTMLCanvasElement {
  constructor(color = 'lightgray') {
    super()
    this.height = window.innerHeight || 600 // height must first
    this.width = document.body.clientWidth || 800
    this.style.backgroundColor = color
    this.weapon = new Image()
    this.target = new Image()
    if (color == 'transparent') {
      this.style.position = 'absolute'
      this.style.left = 0
      this.style.top = 0
      this.style.pointerEvents = 'none'
    }
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

  // ako je ucitano (img.complete) ne slati request!
  // kada hoda da se pomera
  drawWeapon(src, time) {
    if (this.weapon.complete && this.weapon.naturalWidth) {
      const offsetX = Math.cos(time * 2) * 6
      const offsetY = Math.sin(time * 4) * 6
      const x = window.innerWidth * 0.5 - this.weapon.width * 0.5 + offsetX
      const y = window.innerHeight - this.weapon.height + offsetY
      this.ctx.clearRect(x, y, this.weapon.width + Math.abs(offsetX), this.weapon.height)
      this.ctx.drawImage(this.weapon, x, y)
    } else
      this.weapon.src = src
  }

  // ne mora callback ako se poziva redovno
  // dodati parametre za mrdanje, spojiti sa gornjom metodom
  drawFirstPerson(src) {
    if (this.weapon.complete && this.weapon.naturalWidth) {
      const x = window.innerWidth * 0.5 - this.weapon.width * 0.5
      const y = window.innerHeight - this.weapon.height
      this.ctx.drawImage(this.weapon, x, y)
    } else
      this.weapon.src = src
  }

  // mora callback ako se poziva samo jednom
  drawTarget(src) {
    this.target = new Image()
    this.target.onload = () => {
      const x = window.innerWidth * 0.5 - this.target.width * 0.5
      const y = window.innerHeight * 0.5 - this.target.height * 0.5
      this.ctx.drawImage(this.target, x, y)
    }
    this.target.src = src
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
    console.log(x, y)
    this.drawCircle(x, y, size, '#f00')
    this.drawLamp(x, y, size, player.angle, '#ff0')
  }

  renderPlayerFrom3D(player, map) {
    const size = 5
    const playerX = Math.floor(player.x * map.cellSize)
    const playerZ = Math.floor(player.z * map.cellSize)
    // TODO: srediti getMapCoords
    const { x, y } = map.getMapCoords({ x: playerX, z: playerZ })
    console.log(x, y)
    this.drawCircle(x, y, size, '#f00')
  }
}

customElements.define('my-canvas', Canvas, { extends: 'canvas' })
