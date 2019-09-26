import { ctx } from '../2d/fpsRenderer.js'
import {randomInRange} from './helpers.js'

const BROJ_PRSKANJA = 3
const BRZINA_PRSKANJA = 1.5
const MAX_DOMET_PRSKANJA = 30
const VELICINA_BARICE = 3
const BRZINA_BARICE = 0.1

export default class Splash {

  constructor(x, y) {
    this.x = x
    this.y = y
    this.range = 0
    this.ugloviPrskanja = []
  }

  update() {
    if (!this.x || !this.y) return
    this.y += BRZINA_BARICE
    this.range += BRZINA_PRSKANJA
  }

  reset() {
    this.x = null
    this.y = null
  }

  drawPuddle() {
    if (!this.x || !this.y) return
    ctx.beginPath()
    ctx.arc(this.x, this.y, VELICINA_BARICE, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  }

  drawSplash() {
    if (!this.x || !this.y || this.range > MAX_DOMET_PRSKANJA) return
    for (let i = 0; i < BROJ_PRSKANJA; i++) {
      const randomUgao = randomInRange(1, 2) * Math.PI
      this.ugloviPrskanja[i] = this.ugloviPrskanja[i] || randomUgao
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.range, this.ugloviPrskanja[i], this.ugloviPrskanja[i] + 0.1)
      ctx.stroke()
    }
  }

  render() {
    this.drawPuddle()
    this.drawSplash()
  }
}
