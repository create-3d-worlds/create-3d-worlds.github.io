import { getCursorPosition } from '/utils/helpers.js'

/**
 * Render virtual controls and on-screen buttons
 * credit to Nicholas Lever
 */
export default class Screen {
  #jump = false
  #attack = false

  constructor(onMove = () => { }, maxRadius = 40) {
    this.onMove = onMove
    this.forward = this.turn = 0
    this.maxRadius = maxRadius
    this.maxRadiusSquared = this.maxRadius * this.maxRadius

    this.addMovement()
    // TODO: dodavati sve pokrete koje igrač ima
    this.addButton('jump', 'Jmp')
    this.addButton('attack', 'Atk')

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

  /* BUTTONS */

  addMovement() {
    const wrapper = document.createElement('div')
    wrapper.classList.add('game-btn', 'joystick')
    document.body.appendChild(wrapper)

    const thumb = document.createElement('div')
    wrapper.appendChild(thumb)
    this.thumb = thumb

    this.origin = { left: thumb.offsetLeft, top: thumb.offsetTop }
  }

  addButton(name, label = name) {
    const btn = document.createElement('button')
    btn.innerText = label
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

    if (this.onMove) this.onMove(this.forward, this.turn)
  }

  handleEnd = () => {
    document.onpointermove = document.onpointerup = null

    this.thumb.style.top = `${this.origin.top}px`
    this.thumb.style.left = `${this.origin.left}px`

    this.forward = this.turn = 0
    this.onMove(this.forward, this.turn)
  }
}
