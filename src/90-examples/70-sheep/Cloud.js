import { createCloud } from '/utils/shapes.js'

let time = 0

export default class Cloud {
  constructor() {
    this.group = createCloud()
  }

  update() {
    time += 0.08
    this.group.getObjectByName('upperPart').position.y = -Math.cos(time) * 0.12
    this.group.getObjectByName('leftPart').position.y = -Math.cos(time) * 0.1 - 0.3
    this.group.getObjectByName('rightPart').position.y = -Math.cos(time) * 0.1 - 0.3
    this.group.getObjectByName('frontPart').position.y = -Math.cos(time) * 0.08 - 0.3
    this.group.getObjectByName('backPart').position.y = -Math.cos(time) * 0.08 - 0.3
  }
}