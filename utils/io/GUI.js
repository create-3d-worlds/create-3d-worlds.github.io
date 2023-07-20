const isNumber = num => typeof num == 'number'

export default class GUI {
  constructor({
    title = 'Score',
    subtitle = 'left',
    points = 0,
    total,
    messageDict,
    endText = 'Bravo!<br>Nothing left',
    showHighScore = false,
    shouldBlink = false
  } = {}) {
    this.points = points
    this.title = title
    this.subtitle = subtitle
    this.total = total
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

    this.highScore = +localStorage.getItem(location.pathname)

    this.addScore(0, total)
    if (showHighScore) this.renderHeighScore()
  }

  clearText() {
    this.centralDiv.innerHTML = ''
  }

  clearSoon(milliseconds = 3000) {
    setTimeout(() => {
      this.clearText()
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

  renderMessage(left, points = this.points) {
    const message = this.messageDict[points]
    if (message) this.renderTempText(message)
    if (left === 0) this.renderText(this.endText)
  }

  renderHeighScore() {
    if (this.highScore < 2) return
    this.renderTempText(`Your current high score is ${this.highScore} points. Beat it!`)
  }

  renderEndScreen({ text = 'You are dead.', callback } = {}) {
    const html = `
      <h3>${text}</h3>
      <b>Click here to start again</b>  
    `
    if (this.centralDiv.innerHTML === html) return
    this.centralDiv.innerHTML = html
    this.centralDiv.classList.add('rpgui-container', 'framed', 'pointer')
    this.centralDiv.addEventListener('click', () => {
      this.centralDiv.classList.remove('rpgui-container', 'framed', 'pointer')
      this.clearText()
      callback()
    })
  }

  renderScore(points, left) {
    const blink = this.shouldBlink ? 'blink' : ''
    const subtitle = isNumber(left) ? `<br><small class="${blink}">${this.subtitle}: ${left}</small>` : ''

    const innerHTML = `
      <p>
        ${this.title}: ${points}
        ${subtitle}
      </p>
    `
    if (this.scoreDiv.innerHTML === innerHTML) return

    this.scoreDiv.innerHTML = innerHTML

    if (this.messageDict) this.renderMessage(left, points)

    if (points > this.highScore)
      localStorage.setItem(location.pathname, points)
  }

  addScore(change = 1, left) {
    this.points += change
    this.renderScore(this.points, left)
  }
}