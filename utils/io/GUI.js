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
    shouldBlink = false
  } = {}) {
    this.scoreTitle = scoreTitle
    this.subtitle = subtitle
    this.points = points
    this.total = total
    this.controls = controls
    this.messageDict = messageDict
    this.endText = endText
    this.shouldBlink = shouldBlink
    this.tempTextRendered = false

    this.scoreDiv = document.createElement('div')
    this.scoreDiv.className = 'score rpgui-button golden'
    document.body.appendChild(this.scoreDiv)

    this.centralDiv = document.createElement('div')
    this.centralDiv.classList.add('central-screen')
    document.body.appendChild(this.centralDiv)

    this.addUIControls(controls)
    this.addScore(0, total)

    this.highScore = +localStorage.getItem(location.pathname)
    if (showHighScore) this.renderHeighScore()
  }

  /* CENTRAL SCREEN */

  clearSoon(milliseconds = 3000) {
    setTimeout(() => {
      this.centralDiv.innerHTML = ''
      this.tempTextRendered = false
    }, milliseconds)
  }

  renderText(text, blink = false) {
    const cssClass = blink ? 'blink' : ''
    const html = `<h3 class="${cssClass}">${text}</h3>`
    if (this.centralDiv.innerHTML === html) return
    this.centralDiv.innerHTML = html
  }

  renderTempText(message, blink, milliseconds) {
    if (this.tempTextRendered) return
    this.renderText(message, blink)
    this.clearSoon(milliseconds)
    this.tempTextRendered = true
  }

  renderMotivationalMessage(left, points = this.points) {
    const message = this.messageDict[points]
    if (message) this.renderTempText(message)
    if (left === 0) this.renderText(this.endText)
  }

  renderEndScreen({ text = 'You are dead.', callback } = {}) {
    const html = `
    <h3>${text}</h3>
    <b>Click here to start again</b>  
    `
    if (this.centralDiv.innerHTML === html) return

    this.centralDiv.innerHTML = html
    const classes = ['rpgui-container', 'framed', 'pointer']
    this.centralDiv.classList.add(...classes)

    this.centralDiv.addEventListener('click', () => {
      this.centralDiv.classList.remove(...classes)
      this.centralDiv.innerHTML = ''
      callback()
    })
  }

  addStartScreen({ title, innerHTML, callback, className = 'rpgui-container framed' } = {}) {
    const div = document.createElement('div')
    div.className = `central-screen pointer ${className}`
    if (title) div.innerHTML = `<h2>${title}</h2>`

    if (innerHTML) {
      const selectDiv = document.createElement('div')
      selectDiv.className = 'central-screen-select'
      selectDiv.innerHTML = innerHTML
      div.appendChild(selectDiv)
    }

    div.addEventListener('click', e => {
      if (callback) callback(e, div)
      else div.style.display = 'none'
    })

    document.body.appendChild(div)
  }

  renderHeighScore() {
    if (this.highScore < 2) return
    this.renderTempText(`Your current high score is ${this.highScore} points. Beat it!`)
  }

  /* CONTROLS */

  addUIControls(controls) {
    const div = document.createElement('div')
    div.className = 'controls'

    const closedTitle = 'CONTROLS &#9660;'
    const openTitle = 'CONTROLS &#9654;'

    const button = document.createElement('button')
    // button.className = 'rpgui-button'
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

  renderScore(points, left) {
    const blink = this.shouldBlink ? 'blink' : ''
    const subtitle = isNumber(left) ? `<br><small class="${blink}">${this.subtitle}: ${left}</small>` : ''

    const innerHTML = `
      <p>
        ${this.scoreTitle}: ${points}
        ${subtitle}
      </p>
    `
    if (this.scoreDiv.innerHTML === innerHTML) return

    this.scoreDiv.innerHTML = innerHTML

    if (this.messageDict) this.renderMotivationalMessage(left, points)

    if (points > this.highScore)
      localStorage.setItem(location.pathname, points)
  }

  addScore(change = 1, left) {
    this.points += change
    this.renderScore(this.points, left)
  }
}