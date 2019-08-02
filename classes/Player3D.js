import {createBox} from '../utils/3d-helpers.js'
import keyboard from './Keyboard.js'

export default class Player3D {

  constructor(z = 0, x = 0, size = 1) {
    this.mesh = createBox(z, x, size)
    this.mesh.geometry.faces[0].color.set('black')
    this.mesh.geometry.faces[1].color.set('black')
  }

  checkKeys(delta) {
    const distance = 200 * delta // 200 pixels per second
    const angle = Math.PI / 2 * delta // 90 degrees per second

    if (keyboard.pressed.KeyW) this.mesh.translateZ(-distance)
    if (keyboard.pressed.KeyS) this.mesh.translateZ(distance)
    if (keyboard.pressed.KeyA) this.mesh.rotateY(angle)
    if (keyboard.pressed.KeyD) this.mesh.rotateY(-angle)
  }

  update(delta) {
    this.checkKeys(delta)
  }
}
