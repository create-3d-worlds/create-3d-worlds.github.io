import keyboard from '/classes/Keyboard.js'
import { createSheep } from './createSheep.js'

let time = 0

export default class Sheep {
  constructor() {
    this.group = createSheep()
  }

  jump(speed) {
    time += speed
    this.group.position.y = Math.sin(time) + 1.38

    const legRotation = Math.sin(time) * Math.PI / 6 + 0.4

    this.group.getObjectByName('frontRightLeg').rotation.z = legRotation
    this.group.getObjectByName('backRightLeg').rotation.z = legRotation
    this.group.getObjectByName('frontLeftLeg').rotation.z = -legRotation
    this.group.getObjectByName('backLeftLeg').rotation.z = -legRotation

    const earRotation = Math.sin(time) * Math.PI / 3 + 1.5

    this.group.getObjectByName('rightEar').rotation.z = earRotation
    this.group.getObjectByName('leftEar').rotation.z = -earRotation
  }

  updateJump() {
    if (keyboard.pressed.Space)
      this.jump(0.05)
    else {
      if (this.group.position.y <= 0.4) return
      this.jump(0.08)
    }
  }
}
