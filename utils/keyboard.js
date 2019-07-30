import {SPACE, UP, DOWN, LEFT, RIGHT} from './constants.js'

const keyboard = {
  pressed: new Array(256),
  totalPressed: 0,

  reset: () => {
    keyboard.pressed.map(key => {
      keyboard.pressed[key] = false
    })
  }
}

/* FUNCTIONS */

const neTresi = e => {
  if (e.keyCode === SPACE || e.keyCode === UP || e.keyCode === DOWN) e.preventDefault()
}

const odluciKomandu = dodir => {
  if (dodir.pageY < window.innerHeight / 2) keyboard.pressed[UP] = true
  if (dodir.pageY >= window.innerHeight / 2) keyboard.pressed[DOWN] = true
  if (dodir.pageX < window.innerWidth / 2) keyboard.pressed[LEFT] = true
  if (dodir.pageX >= window.innerWidth / 2) keyboard.pressed[RIGHT] = true
}

/* EVENTS */

document.addEventListener('keydown', e => {
  if (!keyboard.pressed[e.keyCode]) keyboard.totalPressed++
  keyboard.pressed[e.keyCode] = true
  neTresi(e)
})

document.addEventListener('keyup', e => {
  keyboard.pressed[e.keyCode] = false
  keyboard.totalPressed--
})

document.addEventListener('touchstart', e => odluciKomandu(e.touches[0]))
document.addEventListener('touchmove', e => odluciKomandu(e.touches[0]))
document.addEventListener('touchend', () => keyboard.reset())

export default keyboard
