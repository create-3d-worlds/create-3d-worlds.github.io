const isNumber = num => typeof num == 'number'

const baseControls = {
  '←': 'left',
  '→': 'right',
  '↑': 'forward',
  '↓': 'backward',
  // 'Space:': 'jump',
  // 'Enter:': 'attack',
  // 'CapsLock:': 'run',
}

export default class GUI {
  constructor({
    scoreTitle = 'Score',
    subtitle = 'left',
    points = 0,
    total,
    controls = baseControls,
    messageDict,
    endText = 'Bravo!<br>Nothing left',
    showHighScore = false,
    useBlink = false,
    scoreClass = 'rpgui-button golden',
    controlsClass = '' // rpgui-button
  } = {}) {
    this.scoreTitle = scoreTitle
    this.subtitle = subtitle
    this.points = points
    this.total = total
    this.controls = controls
    this.messageDict = messageDict
    this.endText = endText
    this.useBlink = useBlink

    this.tempTextRendered = false
    this.playerDead = false

    this.gameScreen = document.createElement('div')
    this.gameScreen.className = 'central-screen'
    document.body.appendChild(this.gameScreen)

    this.addUIControls(controls, controlsClass)

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

  getStartScreen({ goals, title, subtitle }) {
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

  showGameScreen({ goals = [], title = 'Click to START!', subtitle = '', autoClose = true, callback, usePointerLock = false } = {}) {

    const startHTML = this.getStartScreen({ goals, title, subtitle })
    if (this.gameScreen.innerHTML === startHTML) return

    this.openGameScreen(startHTML)

    this.gameScreen.onclick = e => {
      if (callback) callback(e)
      // on pointerlockchange GameLoop starts
      if (usePointerLock) document.body.requestPointerLock({ unadjustedMovement: true })
      if (autoClose) this.clearScreen()
    }

    if (usePointerLock) document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement)
        this.closeGameScreen()
      else
        this.openGameScreen(startHTML)
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

  addUIControls(controls, controlsClass) {
    const div = document.createElement('div')
    div.className = 'controls'

    const closedTitle = 'CONTROLS &#9660;'
    const openTitle = 'CONTROLS &#9654;'

    const button = document.createElement('button')
    button.className = controlsClass
    button.innerHTML = closedTitle

    const content = document.createElement('div')
    content.className = 'rpgui-container framed'
    content.innerHTML = Object.keys(controls).map(key =>
      `<p><b>${key}</b> ${controls[key]}</p>`
    ).join('')
    content.style.display = 'none'

    button.addEventListener('click', () => {
      content.style.display = content.style.display == 'none' ? 'block' : 'none'
      button.innerHTML = content.style.display == 'none' ? closedTitle : openTitle
    })

    div.appendChild(button)
    div.appendChild(content)
    document.body.appendChild(div)
  }

  /* SCORE */

  renderTime() {
    this.renderScore(Math.floor(performance.now() / 1000))
  }

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
}