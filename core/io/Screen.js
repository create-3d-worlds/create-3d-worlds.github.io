import { getCursorPosition } from '/core/helpers.js'

/**
 * Joystick and screen controls
 * credit to Nicholas Lever
 */
export default class Screen {
  #jump = false
  #attack = false
  #attack2 = false
  #special = false

  constructor({ animDict, maxRadius = 40 } = {}) {
    this.forward = this.turn = 0
    this.maxRadius = maxRadius
    this.maxRadiusSquared = this.maxRadius * this.maxRadius

    this.addJoystick()

    if (animDict?.jump) this.addButton('jump', 'Jmp')
    if (animDict?.attack) this.addButton('attack', 'Atk')
    if (animDict?.attack2) this.addButton('attack2', 'Atk')
    if (animDict?.special) this.addButton('special', 'Spl')

    this.thumb.addEventListener('pointerdown', this.handleCursor)
  }

  /* GETTERS */

  get up() {
    return this.forward < -.1
  }

  get down() {
    return this.forward > .1
  }

  get left() {
    return this.turn < -.1
  }

  get right() {
    return this.turn > .1
  }

  get run() {
    return Math.abs(this.forward) > .75
  }

  get attack() {
    return this.#attack
  }

  set attack(bool) {
    this.#attack = bool
  }

  get jump() {
    return this.#jump
  }

  set jump(bool) {
    this.#jump = bool
  }

  get attack2() {
    return this.#attack2
  }

  set attack2(bool) {
    this.#attack2 = bool
  }

  get special() {
    return this.#special
  }

  set special(bool) {
    this.#special = bool
  }

  /* BUTTONS */

  addJoystick() {
    const circle = document.createElement('div')
    circle.classList.add('game-btn', 'joystick')
    document.body.appendChild(circle)

    const thumb = document.createElement('div')
    // style is required here to set origin
    thumb.style = `
      position: absolute; 
      left: 20px; 
      top: 20px; 
      width: 40px; 
      height: 40px; 
      border-radius: 50%; 
      background: #fff;
    `
    circle.appendChild(thumb)
    this.thumb = thumb

    this.origin = { left: thumb.offsetLeft, top: thumb.offsetTop }
  }

  addButton(name, label = name) {
    const btn = document.createElement('button')
    btn.innerText = label
    btn.title = name
    btn.classList.add('game-btn', `${name}-btn`)
    document.body.appendChild(btn)

    btn.addEventListener('pointerdown', () => {
      this[name] = true
    })
    btn.addEventListener('pointerup', () => {
      this[name] = false
    })
  }

  /* HANDLERS */

  handleCursor = e => {
    this.offset = getCursorPosition(e)
    document.onpointermove = this.handleMove
    document.onpointerup = this.handleEnd
  }

  handleMove = e => {
    const mouse = getCursorPosition(e)

    let left = mouse.x - this.offset.x
    let top = mouse.y - this.offset.y

    const sqMag = left * left + top * top
    if (sqMag > this.maxRadiusSquared) {
      // Only use sqrt if essential
      const magnitude = Math.sqrt(sqMag)
      left /= magnitude
      top /= magnitude
      left *= this.maxRadius
      top *= this.maxRadius
    }

    this.thumb.style.top = `${top + this.thumb.clientHeight / 2}px`
    this.thumb.style.left = `${left + this.thumb.clientWidth / 2}px`

    this.forward = (top - this.origin.top + this.thumb.clientHeight / 2) / this.maxRadius
    this.turn = (left - this.origin.left + this.thumb.clientWidth / 2) / this.maxRadius
  }

  handleEnd = () => {
    document.onpointermove = document.onpointerup = null

    this.thumb.style.top = `${this.origin.top}px`
    this.thumb.style.left = `${this.origin.left}px`

    this.forward = this.turn = 0
  }
}
