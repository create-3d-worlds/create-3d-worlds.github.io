import keyboard from '../Keyboard.js'

const CIRCLE = Math.PI * 2
const colors = ['#fff', '#444', '#701206', '#000']

// TODO: separate player class
// TODO: separate small map canvas?
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

  drawRect(x, y, size, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x * size, y * size, size, size)
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  drawWeapon(src, time) {
    this.handleDraw(this.weapon, src, 'justDrawWeapon', time)
  }

  drawTarget(src, time) {
    this.handleDraw(this.target, src, 'justDrawTarget', time)
  }

  handleDraw(img, src, drawMethod, time) {
    if (img.naturalWidth) this[drawMethod](time)
    else {
      img.onload = () => this[drawMethod](time)
      img.src = src
    }
  }

  justDrawWeapon(time) {
    this.drawShake(this.weapon, time, 0.51)
  }

  justDrawTarget(time) {
    this.drawShake(this.target, time, 0.5, 0.55)
  }

  drawShake(img, time = 1, xAlign = 0.5, yAlign = 1) {
    const shaking = keyboard.controlsPressed ? 6 : 1
    const shakeX = Math.cos(time * 2) * shaking
    const shakeY = Math.sin(time * 4) * shaking
    const x = window.innerWidth * xAlign - img.width * 0.5 + shakeX
    const y = window.innerHeight * yAlign - img.height + shakeY + shaking // zbog praznine na dnu
    this.ctx.drawImage(img, x, y)
  }

  drawMap(matrix, cellSize) {
    matrix.forEach((row, y) => row.forEach((val, x) =>
      this.drawRect(x, y, cellSize, colors[val])
    ))
  }

  // TODO: spojiti ove motode
  draw2DPlayerOnMap(player, map) {
    const x = Math.floor(player.x * map.cellSize)
    const y = Math.floor(player.y * map.cellSize)
    this.drawCircle(x, y)
    this.drawLamp(x, y, player.angle)
  }

  draw3DPlayerOnMap(player, map, smallMap) {
    const pos = map.getRelativePos(player)
    const x = pos.x * smallMap.mapSize
    const y = pos.y * smallMap.mapSize
    this.drawCircle(x, y)
  }
}

customElements.define('my-canvas', Canvas, { extends: 'canvas' })
