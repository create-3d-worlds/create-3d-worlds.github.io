const getStyle = () => /* css */`
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

  .end-screen {
    background-color: rgba(242, 242, 242, 0.9);
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

const isNumber = num => typeof num == 'number'

export default class Score {
  constructor({
    title = 'Score',
    points = 0,
    subtitle = 'left',
    total,
    messageDict,
    endText = 'Bravo!<br>Nothing left',
    showHighScore = false,
    shouldBlink = true
  } = {}) {
    this.points = points
    this.title = title
    this.subtitle = subtitle
    this.total = total
    this.messageDict = messageDict
    this.endText = endText
    this.shouldBlink = shouldBlink

    this.scoreDiv = document.createElement('div')
    this.scoreDiv.classList.add('score', 'text')
    document.body.appendChild(this.scoreDiv)

    this.centralDiv = document.createElement('div')
    this.centralDiv.classList.add('central', 'text')
    document.body.appendChild(this.centralDiv)

    const style = document.createElement('style')
    style.textContent = getStyle()
    document.head.appendChild(style)

    this.highScore = +localStorage.getItem(location.pathname)

    this.update(0, total)
    if (showHighScore) this.renderHeighScore()
  }

  clear() {
    this.centralDiv.innerHTML = ''
  }

  clearSoon(milliseconds = 2000) {
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

  renderMessage(left, points = this.points) {
    const message = this.messageDict[points]
    if (message) this.renderTempText(message)
    if (left === 0) this.renderText(this.endText)
  }

  renderHeighScore() {
    if (this.highScore < 2) return
    this.renderTempText(`The current high score is ${this.highScore} points. Beat it!`, 3000)
  }

  renderEndScreen({ text = 'You are dead.', callback } = {}) {
    const html = `
      <h3>${text}</h3>
      <b>Click here to start again</b>  
    `
    if (this.centralDiv.innerHTML === html) return
    this.centralDiv.innerHTML = html
    this.centralDiv.classList.add('end-screen')
    this.centralDiv.addEventListener('click', () => {
      this.centralDiv.classList.remove('end-screen')
      this.clear()
      callback()
    })
  }

  render(points, enemiesLeft, energyLeft) {
    let html = ''
    const blink = this.shouldBlink ? 'blink' : ''
    if (isNumber(points)) html += `<h3>${this.title}: ${points}</h3>`
    if (isNumber(enemiesLeft)) html += `<div class="${blink}">${this.subtitle}: ${enemiesLeft}</div>`
    if (isNumber(energyLeft)) html += `<div class="${blink}">${this.subtitle}: ${energyLeft}</div>`
    if (this.scoreDiv.innerHTML === html) return
    this.scoreDiv.innerHTML = html

    if (this.messageDict) this.renderMessage(enemiesLeft, points)

    if (points > this.highScore)
      localStorage.setItem(location.pathname, points)
  }

  update(change = 1, enemiesLeft, energyLeft) {
    this.points += change
    this.render(this.points, enemiesLeft, energyLeft)
  }
}