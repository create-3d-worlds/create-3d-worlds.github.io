import {CIRCLE, colors} from '../utils/constants.js'

let instance = null

// Singleton
class Canvas extends HTMLCanvasElement {
  constructor() {
    super()
    if (!instance) instance = this
    document.body.style.margin = 0
    document.body.style.padding = 0
    document.body.appendChild(instance)
    return instance
  }

  connectedCallback() {
    this.height = window.innerHeight || 600 // height must first
    this.width = document.body.clientWidth || 800
    this.style.backgroundColor = 'lightgray'
    this.focus()
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

  drawRect(x, y, size, eNum) {
    this.ctx.fillStyle = colors[eNum]
    this.ctx.fillRect(x * size, y * size, size, size)
  }

  get ctx() {
    return this.getContext('2d')
  }

  get diagonal() {
    return Math.sqrt(this.height * this.height + this.width * this.width)
  }
}

customElements.define('my-canvas', Canvas, { extends: 'canvas' })
export default new Canvas
