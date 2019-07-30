import keyboard from '../utils/keyboard.js'
import {CIRCLE, UP, DOWN, LEFT, RIGHT} from '../utils/constants.js'

const speed = 0.3

export default class Player {
  constructor(map, x, y, angle = 0) {
    this.x = x
    this.y = y
    this.angle = angle
    this.map = map
  }

  update() {
    this.proveriTipke()
  }

  hoda(step) {
    const dx = Math.cos(this.angle) * step
    const dy = Math.sin(this.angle) * step
    if (this.map.daj(this.x + dx, this.y) <= 0) this.x += dx
    if (this.map.daj(this.x, this.y + dy) <= 0) this.y += dy
  }

  okreni(brzina) {
    this.angle = (this.angle + brzina + CIRCLE) % (CIRCLE)
  }

  proveriTipke() {
    if (keyboard.pressed[LEFT]) this.okreni(-speed / 2)
    if (keyboard.pressed[RIGHT]) this.okreni(speed / 2)
    if (keyboard.pressed[UP]) this.hoda(speed)
    if (keyboard.pressed[DOWN]) this.hoda(-speed)
  }

  // crtaKruzic(velicinaPolja) {
  //   const x = Math.floor(this.x * velicinaPolja)
  //   const y = Math.floor(this.y * velicinaPolja)
  //   // crta kruzic
  //   podloga.fillStyle = BOJA_KRUZICA
  //   podloga.beginPath()
  //   podloga.arc(x, y, VELICINA_KRUZICA, this.angle, this.angle + CIRCLE)
  //   podloga.fill()
  //   // crta svetlo
  //   podloga.fillStyle = BOJA_LAMPE
  //   podloga.beginPath()
  //   podloga.arc(x, y, VELICINA_KRUZICA, this.angle + CIRCLE, this.angle + CIRCLE)
  //   podloga.arc(x, y, VELICINA_KRUZICA * 3, this.angle - 0.15 * Math.PI, this.angle + 0.15 * Math.PI)
  //   podloga.fill()
  // }

  crtaRadar() {
    this.map.crtaj()
    this.crtaKruzic(this.map.velicinaPolja)
  }
}
