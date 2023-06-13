const getStyle = (color, stroke) => /* css */`
  .score, .central {
    color: ${color};
    font-family: Verdana;
    text-shadow: -1px -1px 0 ${stroke}, 1px -1px 0 ${stroke}, -1px  1px 0 ${stroke}, 1px  1px 0 ${stroke};
    user-select: none;
  }

  .score {
    left: 20px;
    position: absolute;
    top: 20px;
  }

  .score h3 {
    margin: 0 0 8px;
  }

  .central {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 40px 40px 40px;
    text-align: center;
  }

  .blink {
    animation: blinker 1s step-start infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`

const defaultDict = {
  1: 'Well, that\'s a good start!',
  10: 'Keep up the good work!',
  25: 'Nice result so far...',
  50: 'Half down, half to go!',
  75: 'You smell victory in the air...',
}

const isNumber = num => typeof num == 'number'

export default class Score {
  constructor({
    title = 'Score',
    points = 0,
    subtitle = 'left',
    total,
    color = 'yellow',
    stroke = '#000',
    messageDict = defaultDict,
    endText = 'Bravo!<br>Nothing left',
    showMessages = false,
    showHighScore = false,
  } = {}) {
    this.points = points
    this.title = title
    this.subtitle = subtitle
    this.total = total
    this.messageDict = messageDict
    this.showMessages = showMessages
    this.endText = endText

    this.scoreDiv = document.createElement('div')
    this.scoreDiv.className = 'score'
    document.body.appendChild(this.scoreDiv)

    this.centralDiv = document.createElement('div')
    this.centralDiv.className = 'central'
    document.body.appendChild(this.centralDiv)

    const style = document.createElement('style')
    style.textContent = getStyle(color, stroke)
    document.head.appendChild(style)

    this.highScore = +localStorage.getItem(location.pathname)

    this.update(0, total)
    if (showHighScore) this.renderHeighScore()
  }

  clear() {
    this.centralDiv.innerHTML = ''
  }

  clearSoon(milliseconds = 1500) {
    setTimeout(() => this.clear(), milliseconds)
  }

  renderText(text) {
    const html = `<h3>${text}</h3>`
    if (this.centralDiv.innerHTML === html) return
    this.centralDiv.innerHTML = html
  }

  renderTempText(message, milliseconds) {
    this.renderText(message)
    this.clearSoon(milliseconds)
  }

  renderMessage(left) {
    const message = this.messageDict[this.points]
    if (message) this.renderTempText(message)
    if (left === 0) this.renderText(this.endText)
  }

  renderHeighScore() {
    if (this.highScore < 2) return
    this.centralDiv.innerHTML = `<h3>The current high score is ${this.highScore} points. Beat it!</h3>`
    this.clearSoon(3000)
  }

  render(points, enemiesLeft, energyLeft) {
    let html = ''
    if (isNumber(points)) html += `<h3>${this.title}: ${points}</h3>`
    if (isNumber(enemiesLeft)) html += `<div class="blink">${this.subtitle}: ${enemiesLeft}</div>`
    if (isNumber(energyLeft)) html += `<div class="blink">${this.subtitle}: ${energyLeft}</div>`
    if (this.scoreDiv.innerHTML === html) return
    this.scoreDiv.innerHTML = html
  }

  update(change = 1, left, energyLeft) {
    this.points += change
    this.render(this.points, left, energyLeft)

    if (this.showMessages) this.renderMessage(left)

    if (this.points > this.highScore)
      localStorage.setItem(location.pathname, this.points)
  }
}