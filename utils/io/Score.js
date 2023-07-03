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
    this.tempTextRendered = false

    this.scoreDiv = document.createElement('div')
    this.scoreDiv.classList.add('score')
    document.body.appendChild(this.scoreDiv)

    this.centralDiv = document.createElement('div')
    this.centralDiv.classList.add('start-screen')
    document.body.appendChild(this.centralDiv)

    this.highScore = +localStorage.getItem(location.pathname)

    this.update(0, total)
    if (showHighScore) this.renderHeighScore()
  }

  clear() {
    this.centralDiv.innerHTML = ''
  }

  clearSoon(milliseconds = 2000) {
    setTimeout(() => {
      this.clear()
      this.tempTextRendered = false
    }, milliseconds)
  }

  renderText(text) {
    const html = `<h3>${text}</h3>`
    if (this.centralDiv.innerHTML === html) return
    this.centralDiv.innerHTML = html
  }

  renderTempText(message, milliseconds) {
    if (this.tempTextRendered) return
    this.renderText(message)
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
    this.renderTempText(`The current high score is ${this.highScore} points. Beat it!`, 3000)
  }

  renderEndScreen({ text = 'You are dead.', callback } = {}) {
    const html = `
      <h3>${text}</h3>
      <b>Click here to start again</b>  
    `
    if (this.centralDiv.innerHTML === html) return
    this.centralDiv.innerHTML = html
    this.centralDiv.classList.add('dashed-screen')
    this.centralDiv.addEventListener('click', () => {
      this.centralDiv.classList.remove('dashed-screen')
      this.clear()
      callback()
    })
  }

  render(points, left) {
    let html = ''
    const blink = this.shouldBlink ? 'blink' : ''
    if (isNumber(points)) html += `<h3>${this.title}: ${points}</h3>`
    if (isNumber(left)) html += `<div class="${blink}">${this.subtitle}: ${left}</div>`
    if (this.scoreDiv.innerHTML === html) return
    this.scoreDiv.innerHTML = html

    if (this.messageDict) this.renderMessage(left, points)

    if (points > this.highScore)
      localStorage.setItem(location.pathname, points)
  }

  update(change = 1, left) {
    this.points += change
    this.render(this.points, left)
  }
}