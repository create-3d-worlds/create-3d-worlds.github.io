import { getCursorPosition } from '/utils/helpers.js'

const circleCss = `
  position:absolute; 
  bottom:35px; 
  width:80px; 
  height:80px; 
  background:rgba(126, 126, 126, 0.5); 
  border:#fff solid medium; 
  border-radius:50%; 
  left:50%; 
  transform:translateX(-50%);
`

const thumbCss = `
  position: absolute; 
  left: 20px; 
  top: 20px; 
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  background: #fff;
`

export default class JoyStick {
  constructor(onMove = () => {}, maxRadius = 40) {
    this.forward = 0
    this.turn = 0
    const circle = document.createElement('div')
    circle.style.cssText = circleCss
    const thumb = document.createElement('div')
    thumb.style.cssText = thumbCss
    circle.appendChild(thumb)
    document.body.appendChild(circle)
    this.domElement = thumb
    this.maxRadius = maxRadius
    this.maxRadiusSquared = this.maxRadius * this.maxRadius
    this.onMove = onMove
    this.origin = { left: this.domElement.offsetLeft, top: this.domElement.offsetTop }

    if ('ontouchstart' in window)
      this.domElement.addEventListener('touchstart', e => this.tap(e))
    else
      this.domElement.addEventListener('mousedown', e => this.tap(e))
  }

  tap(e) {
    // get the mouse cursor position at startup:
    this.offset = getCursorPosition(e)
    if ('ontouchstart' in window) {
      document.ontouchmove = e => this.move(e)
      document.ontouchend = e => this.up(e)
    } else {
      document.onmousemove = e => this.move(e)
      document.onmouseup = e => this.up(e)
    }
  }

  move(e) {
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

  up() {
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
