import { getCursorPosition } from '/utils/helpers.js'

/**
 * Render virtual joystick and on-screen buttons
 * credit to Nicholas Lever
 */
export default class Screen {
  constructor(onMove = () => { }, maxRadius = 40) {
    this.onMove = onMove
    this.forward = this.turn = 0
    this.maxRadius = maxRadius
    this.maxRadiusSquared = this.maxRadius * this.maxRadius

    this.addMovement()
    this.addJump()
    this.addAttack()

    if ('ontouchstart' in window)
      this.thumb.addEventListener('touchstart', e => this.handleCursor(e))
    else
      this.thumb.addEventListener('mousedown', e => this.handleCursor(e))
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

  addJump() {
    const btn = document.createElement('button')
    btn.innerText = 'Jmp'
    btn.classList.add('game-btn', 'jump-btn')
    document.body.appendChild(btn)
  }

  addAttack() {
    const btn = document.createElement('button')
    btn.innerText = 'Atk'
    btn.classList.add('game-btn', 'attack-btn')
    document.body.appendChild(btn)
  }

  /* HANDLERS */

  handleCursor(e) {
    this.offset = getCursorPosition(e)
    if ('ontouchstart' in window) {
      document.ontouchmove = e => this.handleMove(e)
      document.ontouchend = e => this.handleEnd(e)
    } else {
      document.onmousemove = e => this.handleMove(e)
      document.onmouseup = e => this.handleEnd(e)
    }
  }

  handleMove(e) {
    const mouse = getCursorPosition(e)
    // calculate the new cursor position:
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

    // set the element's new position:
    this.thumb.style.top = `${top + this.thumb.clientHeight / 2}px`
    this.thumb.style.left = `${left + this.thumb.clientWidth / 2}px`

    this.forward = (top - this.origin.top + this.thumb.clientHeight / 2) / this.maxRadius
    this.turn = (left - this.origin.left + this.thumb.clientWidth / 2) / this.maxRadius

    if (this.onMove) this.onMove(this.forward, this.turn)
  }

  handleEnd() {
    if ('ontouchstart' in window) {
      document.ontouchmove = null
      document.touchend = null
    } else {
      document.onmousemove = null
      document.onmouseup = null
    }
    this.thumb.style.top = `${this.origin.top}px`
    this.thumb.style.left = `${this.origin.left}px`

    this.forward = 0
    this.turn = 0
    this.onMove(this.forward, this.turn)
  }
}
