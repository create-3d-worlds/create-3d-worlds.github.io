import { jumpStyles } from '/utils/constants.js'

const isNumber = num => typeof num == 'number'

const baseControls = {
  '← or A': 'left',
  '→ or D': 'right',
  '↑ or W': 'forward',
  '↓ or S': 'backward',
}

export const fpsControls = {
  ...baseControls,
  'PgUp or Q': 'strafe left',
  'PgDn or E': 'strafe right',
  CapsLock: 'run',
  Mouse: 'attack',
  Space: 'jump',
  P: 'pause',
}

export const avatarControls = {
  ...baseControls,
  CapsLock: 'run',
  Space: 'jump',
}

const actionControls = player => {
  if (!player) return {}
  const { actions } = player
  const controls = {}

  if (actions.run) controls.CapsLock = 'run'
  if (actions.jump || player.jumpStyle != jumpStyles.ANIM_JUMP) controls.Space = 'jump'
  if (actions.attack) controls.Enter = 'attack'
  if (actions.attack2) controls.C = 'attack2'
  if (actions.special) controls.V = 'special'

  return controls
}

export default class GUI {
  constructor({
    scoreTitle = 'Score', // if empty no score section
    subtitle = 'left',
    points = 0,
    total,
    scoreClass = 'rpgui-button golden',
    useBlink = false,

    controlsTitle = 'CONTROLS',
    player = null,
    controls = {},
    controlsClass = '', // try rpgui-button
    controlsWindowClass = 'rpgui-container framed',
    controlsOpen = false,

    messageDict,
    endText = 'Bravo!<br>Nothing left',
    showHighScore = false,
  } = {}) {
    this.scoreTitle = scoreTitle
    this.subtitle = subtitle
    this.points = points
    this.total = total
    this.controls = controls
    this.messageDict = messageDict
    this.endText = endText
    this.useBlink = useBlink
    this.controlsOpen = controlsOpen
    this.controlsTitle = controlsTitle

    this.tempTextRendered = false
    this.playerDead = false

    this.gameScreen = document.createElement('div')
    this.gameScreen.className = 'central-screen'
    document.body.appendChild(this.gameScreen)

    const allControls = { ...baseControls, ...actionControls(player), ...controls }
    this.addControls(allControls, controlsClass, controlsWindowClass)

    if (scoreTitle) {
      this.scoreDiv = document.createElement('div')
      this.scoreDiv.className = `score ${scoreClass}`
      document.body.appendChild(this.scoreDiv)
      this.addScore(0, total)

      this.highScore = +localStorage.getItem(location.pathname)
      if (showHighScore) this.showHeighScore()
    }
  }

  reset() {
    this.points = 0
    this.renderScore(0, this.total)
    this.clearScreen()
  }

  /* GAME SCREEN */

  closeSoon(milliseconds = 3000) {
    setTimeout(() => {
      this.closeGameScreen()
      this.tempTextRendered = false
    }, milliseconds)
  }

  renderText(text, blink = false) {
    const blinkClass = blink ? 'blink' : ''
    const html = `<h3 class="${blinkClass}">${text}</h3>`
    if (this.gameScreen.innerHTML === html) return
    this.gameScreen.innerHTML = html
  }

  showMessage(message, blink, milliseconds) {
    if (this.tempTextRendered) return
    this.renderText(message, blink)
    this.closeSoon(milliseconds)
    this.tempTextRendered = true
  }

  showMotivationalMessage(left, points = this.points) {
    const message = this.messageDict[points]
    if (message) this.showMessage(message)
    if (left === 0) this.renderText(this.endText)
  }

  showBlinkingMessage({ message, time, messageInterval = 20 }) {
    if (!this.playerDead && Math.ceil(time) % messageInterval == 0)
      this.showMessage(message, true)
  }

  clearScreen() {
    this.closeGameScreen()
    this.gameScreen.onclick = undefined
  }

  closeGameScreen() {
    this.gameScreen.classList.remove('rpgui-container', 'framed', 'pointer')
    this.gameScreen.innerHTML = ''
  }

  openGameScreen(html) {
    this.gameScreen.classList.add('rpgui-container', 'framed', 'pointer')
    this.gameScreen.innerHTML = html
  }

  getStartScreen({ goals = [], title = 'Click to START!', subtitle = '' } = {}) {
    const li = goals.map(goal => `<li>${goal}</li>`).join('')

    return `
      <ul>${li}</ul>
      <h2>${title}</h2>
      ${subtitle}
    `
  }

  get endScreen() {
    return /* html */`
      <h2>You are dead.</h2>
      <p>Press Reload to play again</p>
    `
  }

  showGameScreen({ callback, autoClose = false, usePointerLock = false, ...params } = {}) {

    const getScreen = () => this.playerDead ? this.endScreen : this.getStartScreen(params)

    if (this.gameScreen.innerHTML === getScreen()) return

    this.openGameScreen(getScreen())

    // HANDLE CLICK
    this.gameScreen.onclick = e => {
      if (callback) callback(e)
      if (autoClose) this.clearScreen()
      if (usePointerLock) document.body.requestPointerLock() // gameLoop starts
    }

    // HANDLE POINTER LOCK
    if (usePointerLock) document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement)
        this.closeGameScreen()
      else
        this.openGameScreen(getScreen())
    })
  }

  showEndScreen(params = {}) {
    this.showGameScreen({ title: 'You are dead.', subtitle: 'Click here to start again', ...params })
  }

  showHeighScore() {
    if (this.highScore < 2) return
    this.showMessage(`Your current high score is ${this.highScore} points. Beat it!`)
  }

  /* CONTROLS */

  addControls(controls, controlsClass, controlsWindowClass) {
    const div = document.createElement('div')
    div.className = 'controls'

    const button = document.createElement('button')
    button.className = controlsClass

    const content = document.createElement('div')
    content.className = controlsWindowClass
    content.innerHTML = Object.keys(controls)
      .filter(key => controls[key])
      .map(key =>
        `<p><b>${key}</b> - ${controls[key]}</p>`
      ).join('')

    const open = () => {
      content.style.display = 'block'
      button.innerHTML = `${this.controlsTitle} &#9654;`
    }

    const close = () => {
      content.style.display = 'none'
      button.innerHTML = `${this.controlsTitle} &#9660;`
    }

    if (this.controlsOpen) open()
    else close()

    button.addEventListener('mouseup', e => {
      e.stopPropagation()
      if (content.style.display == 'none') open()
      else close()
    })

    div.appendChild(button)
    div.appendChild(content)
    document.body.appendChild(div)
  }

  /* SCORE */

  renderScore(points, left) {
    const blink = this.useBlink ? 'blink' : ''
    const subtitle = isNumber(left) ? `<br><small class="${blink}">${this.subtitle}: ${left}</small>` : ''

    const innerHTML = `
      <p>
        ${this.scoreTitle}: ${points}
        ${subtitle}
      </p>
    `
    if (this.scoreDiv.innerHTML === innerHTML) return

    this.scoreDiv.innerHTML = innerHTML

    if (this.messageDict) this.showMotivationalMessage(left, points)

    if (points > this.highScore)
      localStorage.setItem(location.pathname, points)
  }

  addScore(change = 1, left) {
    this.points += change
    this.renderScore(this.points, left)
  }

  /* UTILS */

  renderTime() {
    this.renderScore(Math.floor(performance.now() / 1000))
  }

  /* SCORE */

  update({ time, points, left, dead, blinkingMessage, messageInterval } = {}) {
    this.playerDead = dead
    this.renderScore(points, left)
    if (blinkingMessage) this.showBlinkingMessage({ time, message: blinkingMessage, messageInterval })
  }
}
