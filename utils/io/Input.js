import Screen from './Screen.js'
import Keyboard from './Keyboard.js'

/**
 * Interface class for all kind of user inputs
 */
class Input {
  constructor({ useScreen = true, useKeyboard = true } = {}) {
    if (useKeyboard) this.keyboard = new Keyboard()
    if (useScreen) this.screen = new Screen()
  }

  /* GETTERS */

  get up() {
    return this.keyboard?.up || this.screen?.up
  }

  get down() {
    return this.keyboard?.down || this.screen?.down
  }

  get left() {
    return this.keyboard?.left || this.screen?.left
  }

  get right() {
    return this.keyboard?.right || this.screen?.right
  }

  get strafeLeft() {
    return this.keyboard?.strafeLeft
  }

  get strafeRight() {
    return this.keyboard?.strafeRight
  }

  get run() {
    return this.keyboard?.run || this.screen?.run
  }

  get jump() {
    return this.keyboard?.jump || this.screen?.jump
  }

  get attack() {
    return this.keyboard?.attack || this.screen?.attack
  }

  get attack2() {
    return this.keyboard?.attack2 || this.screen?.attack2
  }

  get special() {
    return this.keyboard?.special || this.screen?.special
  }

  get controlsPressed() {
    return this.keyboard?.controlsPressed
  }

  get keyPressed() {
    return this.keyboard?.keyPressed
  }

  get touched() {
    return this.keyboard?.touched
  }
}

export default Input