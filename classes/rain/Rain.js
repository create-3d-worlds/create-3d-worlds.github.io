import Raindrop from './Raindrop.js'
import { fpsRenderer as canvas, ctx } from '../2d/fpsRenderer.js'

const totalDrops = 300
const fraquency = 100 // manji broj brzi zalet
let then = 0

export default class Rain {
  constructor() {
    this.drops = []
  }

  shouldNotAdd(now) {
    return now - then < fraquency || this.drops.length > totalDrops
  }

  addDrop(now) {
    if (this.shouldNotAdd(now)) return
    this.drops.push(new Raindrop())
    then = now
  }

  clear() {
    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  renderDrops() {
    this.drops.forEach(drop => drop.render())
  }

  update(now) {
    this.addDrop(now)
    this.drops.forEach(drop => drop.update())
    this.clear()
    this.renderDrops()
  }
}
