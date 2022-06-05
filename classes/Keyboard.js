/*
* Singleton object for user input (including keyboard, touchscreen and mouse)
* see keycode.info
*/
class Keyboard {

  constructor() {
    this.pressed = {}
    this.capsLock = false
    this.startX = null

    document.addEventListener('keydown', e => {
      this.preventShake(e)
      this.pressed[e.code] = true
    })
    document.addEventListener('keyup', e => {
      this.pressed[e.code] = false
      this.capsLock = e.getModifierState('CapsLock')
    })

    document.addEventListener('mousedown', e => {
      this.pressed.mouse = e.button === 0
      this.pressed.mouse2 = e.button === 2
      this.startX = e.pageX
    })
    document.addEventListener('mouseup', e => {
      if (e.button === 0)
        this.pressed.mouse = this.pressed.ArrowLeft = this.pressed.ArrowRight = false
      if (e.button === 2)
        this.pressed.mouse2 = false
    })
    document.addEventListener('mousemove', e => this.chooseDirection(e))

    document.addEventListener('visibilitychange', () => this.reset())
    window.addEventListener('blur', () => this.reset())
  }

  chooseDirection(e) {
    if (!this.pressed.mouse) return
    this.pressed.ArrowLeft = e.pageX < this.startX
    this.pressed.ArrowRight = e.pageX > this.startX
  }

  reset() {
    for (const key in this.pressed) this.pressed[key] = false
  }

  preventShake(e) {
    if (e.code == 'Space' || e.code.startsWith('Arrow')) e.preventDefault()
  }

  /* GETTERS */
  // not a functions, call it wihout parentheses

  get up() {
    return this.pressed.ArrowUp || this.pressed.KeyW
  }

  get down() {
    return this.pressed.ArrowDown || this.pressed.KeyS
  }

  get left() {
    return this.pressed.ArrowLeft || this.pressed.KeyA
  }

  get right() {
    return this.pressed.ArrowRight || this.pressed.KeyD
  }

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
}

export default new Keyboard
