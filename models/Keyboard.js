import {SPACE, UP, DOWN, LEFT, RIGHT} from '../utils/constants.js'

const preventShake = e => {
  if (e.keyCode === SPACE || e.keyCode === UP || e.keyCode === DOWN) e.preventDefault()
}

// Singleton
class Keyboard {
  constructor() {
    this.pressed = new Array(256)
    this.addEvents()
  }

  get totalPressed() {
    return this.pressed.filter(x => x).length
  }

  addEvents() {
    document.addEventListener('keydown', e => {
      this.pressed[e.keyCode] = true
      preventShake(e)
    })

    document.addEventListener('keyup', e => {
      this.pressed[e.keyCode] = false
    })

    document.addEventListener('touchstart', e => this.chooseDirection(e.touches[0]))
    document.addEventListener('touchmove', e => this.chooseDirection(e.touches[0]))
    document.addEventListener('touchend', () => this.reset())
  }

  chooseDirection(touch) {
    if (touch.pageY < window.innerHeight / 2) this.pressed[UP] = true
    if (touch.pageY >= window.innerHeight / 2) this.pressed[DOWN] = true
    if (touch.pageX < window.innerWidth / 2) this.pressed[LEFT] = true
    if (touch.pageX >= window.innerWidth / 2) this.pressed[RIGHT] = true
  }

  reset() {
    this.pressed.forEach(key => {
      this.pressed[key] = false
    })
  }
}

export default new Keyboard
