import Splash from './Splash.js'
import { ctx } from '../2d/fpsRenderer.js'
import { randomInRange } from './helpers.js'

const minDropHeight = 3
const maxDropHeight = 10
const avgHeight = (minDropHeight + maxDropHeight) / 2
const avgSpeed = 20

let windDirection = 0
let lastMouseX = 0

function handleWind(e) {
  windDirection = (e.clientX - lastMouseX) * 0.1
  lastMouseX = e.clientX
}

export default class Raindrop {
  constructor() {
    this.height = Math.random() * (maxDropHeight - minDropHeight) + minDropHeight
    const heightDiff = this.height - avgHeight
    this.speed = avgSpeed + heightDiff
    this.reset()
    document.addEventListener('mousemove', handleWind)
  }

  reset() {
    this.x = randomInRange(-window.innerWidth / 2, window.innerWidth * 2)
    this.y = randomInRange(-100, -10)
  }

  update() {
    this.y += this.speed
    this.x += windDirection
    if (this.y > window.innerHeight) {
      this.prskanje = new Splash(this.x, this.y)
      this.reset()
    }
    if (this.prskanje) this.prskanje.update()
  }

  render() {
    const dropColor = 'rgba(200, 200, 255, .8)'
    ctx.fillStyle = ctx.strokeStyle = dropColor
    ctx.fillRect(this.x, this.y, 1, this.height)
    if (this.prskanje) this.prskanje.render()
  }
}
