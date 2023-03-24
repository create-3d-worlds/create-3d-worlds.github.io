/*
* Handle user input (including keyboard, touchscreen and mouse)
* (joystick can be optionally attached)
* key codes: keycode.info
*/

const preventSome = e => {
  // prevent shake and random btn click on enter
  if (e.code == 'Space' || e.code == 'Enter' || e.code.startsWith('Arrow')) e.preventDefault()
}

class Input {

  constructor(listen = true) {
    this.pressed = {}
    this.capsLock = false

    this.SwipeX = 0
    this.SwipeY = 0

    this.startX = null
    this.startY = null
    this.swipeThreshold = 5

    if (!listen) return

    document.addEventListener('contextmenu', e => e.preventDefault())

    document.addEventListener('keydown', e => {
      preventSome(e)
      this.pressed[e.code] = true
    })
    document.addEventListener('keyup', e => {
      this.pressed[e.code] = false
      this.capsLock = e.getModifierState('CapsLock')
    })

    document.addEventListener('pointerdown', e => this.handleMouseDown(e))
    document.addEventListener('pointerup', e => this.handleMouseUp(e))
    document.addEventListener('pointermove', e => this.checkDirection(e))

    document.addEventListener('mousedown', e => this.handleMouseDown(e))
    document.addEventListener('mouseup', e => this.handleMouseUp(e))
    document.addEventListener('mousemove', e => this.checkDirection(e))

    document.addEventListener('visibilitychange', () => this.reset())
    window.addEventListener('blur', () => this.reset())
  }

  handleMouseDown(e) {
    if (e.button === 0)
      this.pressed.mouse = true
    if (e.button === 2)
      this.pressed.mouse2 = true
    this.startX = e.pageX
    this.startY = e.pageY
  }

  handleMouseUp(e) {
    if (e.button === 0) {
      this.pressed.mouse = false
      this.resetSwipe()
    }
    if (e.button === 2)
      this.pressed.mouse2 = false
  }

  checkDirection(e) {
    if (!this.pressed.mouse) return
    this.SwipeX = e.pageX - this.startX
    this.SwipeY = e.pageY - this.startY
  }

  resetSwipe() {
    this.SwipeX = this.SwipeY = 0
  }

  reset() {
    for (const key in this.pressed) delete this.pressed[key]
  }

  /* GETTERS & SETTERS */

  get amountForward() {
    return this.joystick?.forward
  }

  get up() {
    return this.pressed.ArrowUp || this.pressed.KeyW || this.amountForward < -.1
  }

  set up(bool) {
    this.pressed.ArrowUp = bool
  }

  get down() {
    return this.pressed.ArrowDown || this.pressed.KeyS || this.amountForward > .1
  }

  get left() {
    return this.pressed.ArrowLeft || this.pressed.KeyA || this.joystick?.turn < -.1
  }

  get right() {
    return this.pressed.ArrowRight || this.pressed.KeyD || this.joystick?.turn > .1
  }

  get sideLeft() {
    return this.pressed.PageUp || this.pressed.KeyQ
  }

  get sideRight() {
    return this.pressed.PageDown || this.pressed.KeyE
  }

  get run() {
    return this.capsLock || Math.abs(this.amountForward) > .75
  }

  set run(bool) {
    this.capsLock = bool
  }

  get space() {
    return this.pressed.Space
  }

  get attack() {
    return this.pressed.Enter
  }

  set attack(bool) {
    this.pressed.Enter = bool
  }

  get attack2() {
    return this.pressed.ShiftRight
  }

  get backspace() {
    return this.pressed.Backspace
  }

  get shift() {
    return this.pressed.ShiftLeft || this.pressed.ShiftRight
  }

  get control() {
    return this.pressed.ControlLeft || this.pressed.ControlRight
  }

  /* UTILS */

  get arrowPressed() {
    return this.pressed.ArrowRight || this.pressed.ArrowLeft || this.pressed.ArrowDown || this.pressed.ArrowUp
  }

  get controlsPressed() {
    return this.arrowPressed || this.pressed.KeyW || this.pressed.KeyA || this.pressed.KeyS || this.pressed.KeyD
  }

  get totalPressed() {
    return Object.values(this.pressed).filter(x => x).length
  }

  get keyPressed() {
    return this.totalPressed > 0
  }

  get touched() {
    return Object.keys(this.pressed).length > 0
  }

  /* SWIPES */

  get swipeLeft() {
    return this.SwipeX < -this.swipeThreshold
  }

  get swipeRight() {
    return this.SwipeX > this.swipeThreshold
  }

  get swipeUp() {
    return this.SwipeY < -this.swipeThreshold
  }

  get swipeDown() {
    return this.SwipeY > this.swipeThreshold
  }

}

export { Input }         // export class
export default new Input // export instance (singleton)