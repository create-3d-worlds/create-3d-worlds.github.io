const getStyle = (color, stroke) => /* css */`
  body {
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
  constructor({ title = 'Score', points = 0, subtitle, totalPoints, color = 'yellow', stroke = '#000', messageDict = defaultDict, showHighScore = false } = {}) {
    this.points = points
    this.title = title
    this.subtitle = subtitle
    this.totalPoints = totalPoints
    this.messageDict = messageDict

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

    this.update(points, totalPoints)
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

  renderMotivation() {
    const message = this.messageDict[this.points]
    if (message) this.renderTempText(message)
  }

  renderHeighScore() {
    if (this.highScore < 2) return
    this.centralDiv.innerHTML = `<h3>The current high score is ${this.highScore} points. Beat it!</h3>`
    this.clearSoon(3000)
  }

  render(points, enemiesLeft, energyLeft) {
    let html = ''
    if (isNumber(points)) html += `<h3>${this.title}: ${this.points}</h3>`
    if (isNumber(enemiesLeft)) html += `<div class="blink">${this.subtitle}: ${enemiesLeft}</div>`
    if (isNumber(energyLeft)) html += `<div class="blink">${this.subtitle}: ${energyLeft}</div>`
    if (this.scoreDiv.innerHTML === html) return
    this.scoreDiv.innerHTML = html
  }

  update(newPoints = 1, enemiesLeft, energyLeft) {
    this.points += newPoints
    this.render(this.points, enemiesLeft, energyLeft)

    this.renderMotivation()

    if (enemiesLeft === 0) this.renderText('BRAVO!<br>You have collected all coins')

    if (this.points > this.highScore)
      localStorage.setItem(location.pathname, this.points)
  }
}