import keyboard from '/classes/Keyboard.js'
import { createSheep } from '/utils/shapes.js'

let time = 0

export default class Sheep {
  constructor() {
    this.group = createSheep()
  }

  updateJump() {
    if (!keyboard.pressed.Space && this.group.position.y <= 0.4) return
    const speed = 0.06
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
}
