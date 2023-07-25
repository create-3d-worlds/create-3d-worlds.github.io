/* credit to Nicholas Lever */
import { getCursorPosition } from '/utils/helpers.js'

const circleCss = `
  background:rgba(126, 126, 126, 0.5); 
  border-radius:50%; 
  border:#fff solid medium; 
  bottom:35px; 
  height:80px; 
  left:50%; 
  position:absolute; 
  transform:translateX(-50%);
  width:80px; 
`

const thumbCss = `
  background: #fff;
  border-radius: 50%; 
  height: 40px; 
  left: 20px; 
  position: absolute; 
  top: 20px; 
  width: 40px; 
`

export default class Screen {
  constructor(onMove = () => { }, maxRadius = 40) {
    this.onMove = onMove
    this.forward = 0
    this.turn = 0
    this.maxRadius = maxRadius
    this.maxRadiusSquared = this.maxRadius * this.maxRadius

    const circle = document.createElement('div')
    circle.style.cssText = circleCss
    const thumb = document.createElement('div')
    thumb.style.cssText = thumbCss
    circle.appendChild(thumb)
    document.body.appendChild(circle)
    this.domElement = thumb

    this.origin = { left: thumb.offsetLeft, top: thumb.offsetTop }

    if ('ontouchstart' in window)
      this.domElement.addEventListener('touchstart', e => this.handleStart(e))
    else
      this.domElement.addEventListener('mousedown', e => this.handleStart(e))
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

  /* METHODS */

  handleStart(e) {
    // get the mouse cursor position at startup:
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
    this.domElement.style.top = `${top + this.domElement.clientHeight / 2}px`
    this.domElement.style.left = `${left + this.domElement.clientWidth / 2}px`

    this.forward = (top - this.origin.top + this.domElement.clientHeight / 2) / this.maxRadius
    this.turn = (left - this.origin.left + this.domElement.clientWidth / 2) / this.maxRadius

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
    this.domElement.style.top = `${this.origin.top}px`
    this.domElement.style.left = `${this.origin.left}px`

    this.forward = 0
    this.turn = 0
    this.onMove(this.forward, this.turn)
  }
}
