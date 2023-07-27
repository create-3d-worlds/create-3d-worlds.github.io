// prevent shake, click on enter, scroll, etc.
const preventSome = e => {
  if (['Space', 'Enter', 'PageUp', 'PageDown'].includes(e.code) || e.code.startsWith('Arrow'))
    e.preventDefault()
}

class Keyboard {
  #capsLock = false

  constructor(listen = true, attackKey = 'Enter') {
    this.pressed = {}
    this.attackKey = attackKey

    if (!listen) return

    document.addEventListener('contextmenu', e => e.preventDefault())

    document.addEventListener('keydown', e => {
      preventSome(e)
      this.pressed[e.code] = true
    })
    document.addEventListener('keyup', e => {
      this.pressed[e.code] = false
      this.run = e.getModifierState('CapsLock')
    })

    document.addEventListener('pointerdown', this.handlePointerDown)
    document.addEventListener('pointerup', this.handlePointerUp)

    document.addEventListener('visibilitychange', this.reset)
    window.addEventListener('blur', this.reset)
  }

  handlePointerDown = e => {
    if (e.button === 0) this.pressed.pointer = true
  }

  handlePointerUp = e => {
    if (e.button === 0) this.pressed.pointer = false
  }

  reset = () => {
    for (const key in this.pressed) delete this.pressed[key]
  }

  /* GETTERS & SETTERS */

  get up() {
    return this.pressed.ArrowUp || this.pressed.KeyW
  }

  set up(bool) {
    this.pressed.ArrowUp = bool
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

  get sideLeft() {
    return this.pressed.PageUp || this.pressed.KeyQ
  }

  get sideRight() {
    return this.pressed.PageDown || this.pressed.KeyE
  }

  get run() {
    return this.#capsLock
  }

  set run(bool) {
    this.#capsLock = bool
  }

  get jump() {
    return this.pressed.Space
  }

  get attack() {
    return this.pressed[this.attackKey]
  }

  get attack2() {
    return this.pressed.KeyC
  }

  get special() {
    return this.pressed.KeyV
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
}

export default Keyboard

export const keyboard = new Keyboard() // export instance