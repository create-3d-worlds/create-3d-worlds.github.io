import Canvas from './Canvas.js'
import keyboard from '../Keyboard.js'

const targetSrc = '/assets/images/crosshair.png'

export default class FirstPersonRenderer extends Canvas {
  constructor(weaponSrc = '/assets/images/savo.png') {
    super()
    this.weaponSrc = weaponSrc
    this.weapon = new Image()
    this.target = new Image()
  }

  drawWeapon(time) {
    this.handleDraw(this.weapon, this.weaponSrc, 'justDrawWeapon', time)
  }

  drawTarget(time) {
    this.handleDraw(this.target, targetSrc, 'justDrawTarget', time)
  }

  handleDraw(img, src, drawMethod, time) {
    if (img.complete && img.naturalWidth) this[drawMethod](time)
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

  render(time) {
    this.clear()
    this.drawWeapon(time)
    this.drawTarget(time)
  }
}

customElements.define('my-first-person', FirstPersonRenderer, { extends: 'canvas' })
